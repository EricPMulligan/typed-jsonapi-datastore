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

export class JsonApiDataStoreModel {
  constructor(type:string, id:string);
  serialize(options:JsonApiSerializationOptions):any;
}

