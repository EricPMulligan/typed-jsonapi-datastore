export class JsonApiDataStore {
  constructor();
  destroy(model:JsonApiDataStoreModel):void;
  find(type:string, id:string | number):JsonApiDataStoreModel;
  findAll(type:string):Array<JsonApiDataStoreModel>;
  reset():void;
  initModel(type:string, id:string | number):JsonApiDataStoreModel;
  syncRecord(rec:JsonApiResource):JsonApiDataStoreModel;
  syncWithMeta(payload:JsonApiPayload):JsonApiDataStoreModelWithMeta;
  sync(payload:JsonApiPayload):JsonApiDataStoreModel | Array<JsonApiDataStoreModel>;
  graph:JsonApiDataStoreGraph;
}

export interface JsonApiDataStoreGraph {
  [paramName:string]:any;
}

export class JsonApiDataStoreModel {
  constructor(type:string, id?:string | number);
  serialize(options?:JsonApiSerializationOptions):JsonApiPayload;
  setAttribute(attrName:string, value:any):void;
  setRelationship(relName:string, models:any):void;
  [paramName:string]:any;
  id:number | string;
  _type:string;
  _attributes:Array<string>;
  _relationships:Array<string>;
  _placeHolder:boolean;
  meta:any;
}

export interface JsonApiDataStoreModelWithMeta {
  data:JsonApiDataStoreModel | Array<JsonApiDataStoreModel>;
  meta:any;
}

export interface JsonApiError {
  id?:number | string;
  links?:JsonApiPayloadLinks;
  status?:string;
  code?:string;
  title?:string;
  detail?:string;
  source?:JsonApiErrorSource;
  meta?:any;
}

export interface JsonApiErrorSource {
  pointer?:string;
  parameter?:string;
}

export interface JsonApiResource {
  type:string;
  id?:string | number;
  attributes?:JsonApiResourceAttributes;
  relationships?:JsonApiResourceRelationships;
  links?:JsonApiResourceLinks;
  meta?:any;
}

export interface JsonApiResourceAttributes {
  [propName:string]:any;
}

export interface JsonApiResourceRelationships {
  [relationshipName:string]:JsonApiResourceRelationshipEntry;
}

export interface JsonApiResourceRelationshipEntry {
  links?:JsonApiResourceRelationshipLinks;
  data?:JsonApiResource | Array<JsonApiResource>;
  meta?:any;
}

export interface JsonApiSerializationOptions {
  attributes?:Array<string>;
  relationships?:Array<string>;
}

export interface JsonApiPayload {
  data?:JsonApiResource | Array<JsonApiResource>;
  errors?:Array<JsonApiError>;
  links?:JsonApiPayloadLinks;
  included?:Array<JsonApiResource>;
}

export interface JsonApiLinks {
  self?:string | JsonApiLink;
  next?:string | JsonApiLink;
  last?:string | JsonApiLink;
  about?:string | JsonApiLink;
}

export interface JsonApiLink {
  href?:string;
  meta?:any;
}

export interface JsonApiPayloadLinks extends JsonApiLinks {

}

export interface JsonApiResourceLinks extends JsonApiLinks {

}

export interface JsonApiResourceRelationshipLinks {
  related:string | JsonApiLink;
}
