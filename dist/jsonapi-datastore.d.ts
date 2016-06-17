export class JsonApiDataStore<T> {
  constructor();
  destroy(model:T):void;
  find(type:string, id:string):T;
  findAll(type:string):Array<T>;
  reset():void;
  initModel(type:string, id:string):JsonApiDataStoreModel;

}

interface JsonApiSerializationOptions {
  attributes?:Array<string>;
  relationships?:Array<string>;
}

export class JsonApiDataStoreModel<T> {
  constructor(type:string, id:number);
  serialize(options?:JsonApiSerializationOptions):any;
  setAttribute(attrName:string, value:T):void;

}

