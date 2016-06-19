import {JsonApiDataStoreModel} from "jsonapi-datastore";
import {JsonApiDataStore} from "jsonapi-datastore";
import {JsonApiPayload} from "jsonapi-datastore";
import {JsonApiResource} from "jsonapi-datastore";

var fs = require('fs'),
    expect = require('chai').expect;

describe('JsonApiDataModel', () => {
  describe('.serialize()', () => {
    it('should serialize a bare model', () => {
      let serializedModel:JsonApiPayload = new JsonApiDataStoreModel('datatype', 1337).serialize();
      expect(serializedModel).to.deep.eq(<JsonApiPayload>{
        data: {
          id: 1337,
          type: 'datatype'
        }
      });
    });

    it('should serialize all attributes by default', () => {
      let store:JsonApiDataStore = new JsonApiDataStore(),
          payload:JsonApiPayload = <JsonApiPayload>{
            data: {
              type: 'article',
              id: 1337,
              attributes: {
                title: 'Cool article',
                author: 'Lucas'
              }
            }
          };

      var article:JsonApiDataStoreModel = <JsonApiDataStoreModel> store.sync(payload);
      var serializedArticle:JsonApiPayload = article.serialize();
      expect(serializedArticle).to.deep.eq(payload);
    });

    it('should serialize all relationships by default', () => {
      let store = new JsonApiDataStore(),
          payload = <JsonApiPayload>{
            data: {
              type: 'article',
              id: 1337,
              attributes: {
                title: 'Cool article'
              },
              relationships: {
                author: {
                  data: {
                    type: 'user',
                    id: 3
                  }
                }
              }
            }
          };

      let article:JsonApiDataStoreModel = <JsonApiDataStoreModel> store.sync(payload);
      let serializedArticle:JsonApiPayload = article.serialize();
      expect(serializedArticle).to.deep.eq(payload);
    });

    it('should serialize only specified attributes', () => {
      let store = new JsonApiDataStore(),
          payload = <JsonApiPayload>{
            data: {
              type: 'article',
              id: 1337,
              attributes: {
                title: 'Cool article',
                author: 'Lucas'
              }
            }
          };

      let article:JsonApiDataStoreModel = <JsonApiDataStoreModel> store.sync(payload);
      let serializedArticle:JsonApiPayload = article.serialize({ attributes: [ 'author' ] });
      let data:JsonApiResource = <JsonApiResource> serializedArticle.data;
      expect(data.attributes['title']).to.be.undefined;
    });

    it('should serialize only specified relationships', () => {
      let store = new JsonApiDataStore(),
          payload = <JsonApiPayload>{
            data: {
              type: 'article',
              id: 1337,
              attributes: {
                title: 'Cool article'
              },
              relationships: {
                author: {
                  data: {
                    type: 'user',
                    id: 3
                  }
                },
                tags: {
                  data: [
                    { type: 'tag', id: 12 },
                    { type: 'tag', id: 74 }
                  ]
                }
              }
            }
          };

      let article:JsonApiDataStoreModel = <JsonApiDataStoreModel> store.sync(payload);
      let serializedArticle:JsonApiPayload = article.serialize({ relationships: [ 'author' ] });
      let data:JsonApiResource = <JsonApiResource> serializedArticle.data;
      expect(data.relationships['tags']).to.be.undefined;
    });

    it('should not serialize the id on fresh models', () => {
      let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
      let serializedArticle:JsonApiPayload = article.serialize();
      let data:JsonApiResource = <JsonApiResource> serializedArticle.data;
      expect(data.id).to.be.undefined;
    });

    it('should handle empty to-one relationships', () => {
      let store:JsonApiDataStore = new JsonApiDataStore(),
          payload = <JsonApiPayload>{
            data: {
              type: 'article',
              id: 1337,
              relationships: {
                author: {
                  data: null
                }
              }
            }
          };

      let article:JsonApiDataStoreModel = <JsonApiDataStoreModel> store.sync(payload);
      let serializedArticle:JsonApiPayload = article.serialize();
      let data:JsonApiResource = <JsonApiResource> serializedArticle.data;
      expect(data.relationships['author'].data).to.be.null;
    });
  });

  describe('.setAttribute()', () => {
    context('when attribute is not set', () => {
      it('should add a new attribute', () => {
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setAttribute('title', 'Cool article');
        expect(article['title']).to.eq('Cool article');
      });

      it('should add the new attribute to the list of attributes', () => {
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setAttribute('title', 'Cool article');
        expect(article._attributes).to.include('title');
      });
    });

    context('when attribute is set', () => {
      it('should modify existing attribute', () => {
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setAttribute('title', 'Cool article');
        article.setAttribute('title', 'Cooler article');
        expect(article['title']).to.eq('Cooler article');
      });

      it('should not duplicate attribute in the list of attributes', () => {
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setAttribute('title', 'Cool article');
        article.setAttribute('title', 'Cooler article');
        expect(article._attributes.filter(function(val) { return val == 'title'; }).length).to.eq(1);
      });
    });
  });

  describe('.setRelationship()', () => {
    context('when relationship is not set', () => {
      it('should add a new relationship', () => {
        let user:JsonApiDataStoreModel = new JsonApiDataStoreModel('user', 13);
        user.setAttribute('name', 'Lucas');
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setRelationship('author', user);
        expect(article['author'].name).to.eq('Lucas');
      });

      it('should add the new relationship to the list of relationships', () => {
        let user:JsonApiDataStoreModel = new JsonApiDataStoreModel('user', 13);
        user.setAttribute('name', 'Lucas');
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setRelationship('author', user);
        expect(article._relationships).to.include('author');
      });
    });

    context('when relationship is set', () => {
      it('should modify existing relationship', () => {
        let user1:JsonApiDataStoreModel = new JsonApiDataStoreModel('user', 13),
            user2:JsonApiDataStoreModel = new JsonApiDataStoreModel('user', 14);
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setRelationship('author', user1);
        article.setRelationship('author', user2);
        expect(article['author'].id).to.eq(14);
      });

      it('should not duplicate relationship in the list of relationships', () => {
        let user1:JsonApiDataStoreModel = new JsonApiDataStoreModel('user', 13),
            user2:JsonApiDataStoreModel = new JsonApiDataStoreModel('user', 14);
        let article:JsonApiDataStoreModel = new JsonApiDataStoreModel('article');
        article.setRelationship('author', user1);
        article.setRelationship('author', user2);
        expect(article._relationships.filter(function(val) { return val == 'author'; }).length).to.eq(1);
      });
    });
  });
});
