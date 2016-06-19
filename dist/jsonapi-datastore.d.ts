declare module 'jsonapi-datastore' {
  export class JsonApiDataStore {
    constructor();
    destroy(model:JsonApiDataStoreModel):void;
    find(type:string, id:string | number):JsonApiDataStoreModel;
    findAll(type:string):Array<JsonApiDataStoreModel>;
    reset():void;
    initModel(type:string, id:string | number):JsonApiDataStoreModel;
    syncRecord(rec:JsonApiResource):JsonApiDataStoreModel;
    syncWithMeta(payload:JsonApiPayload):JsonApiPayload;
    sync(payload:JsonApiPayload):any;
  }

  export class JsonApiDataStoreModel {
    constructor(type:string, id?:string | number);
    serialize(options?:JsonApiSerializationOptions):JsonApiPayload;
    setAttribute(attrName:string, value:any):void;
    setRelationship(relName:string, models:any):void;
  }

  interface JsonApiError {
    id?:number | string;
    links?:JsonApiPayloadLinks;
    status?:string;
    code?:string;
    title?:string;
    detail?:string;
    source?:JsonApiErrorSource;
    meta?:any;
  }

  interface JsonApiErrorSource {
    pointer?:string;
    parameter?:string;
  }

  interface JsonApiResource {
    type:string;
    id?:string | number;
    attributes?:JsonApiResourceAttributes;
    relationships?:JsonApiResourceRelationships;
    links?:JsonApiResourceLinks;
    meta?:any;
  }

  interface JsonApiResourceAttributes {
    [attributeName:string]:any;
  }

  interface JsonApiResourceRelationships {
    [relationshipName:string]:JsonApiResourceRelationshipEntry;
  }

  interface JsonApiResourceRelationshipEntry {
    links?:JsonApiResourceRelationshipLinks;
    data?:JsonApiResource | Array<JsonApiResource>;
    meta?:any;
  }

  interface JsonApiSerializationOptions {
    attributes?:Array<string>;
    relationships?:Array<string>;
  }

  interface JsonApiPayload {
    data?:JsonApiResource | Array<JsonApiResource>;
    errors?:Array<JsonApiError>;
    links?:JsonApiPayloadLinks;
    included?:Array<JsonApiResource>;
  }

  interface JsonApiLinks {
    self?:string | JsonApiLink;
    next?:string | JsonApiLink;
    last?:string | JsonApiLink;
    about?:string | JsonApiLink;
  }

  interface JsonApiLink {
    href?:string;
    meta?:any;
  }

  interface JsonApiPayloadLinks extends JsonApiLinks {

  }

  interface JsonApiResourceLinks extends JsonApiLinks {

  }

  interface JsonApiResourceRelationshipLinks {
    related:string | JsonApiLink;
  }
}
