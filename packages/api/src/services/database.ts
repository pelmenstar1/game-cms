import type { EntityConditionalData } from '@game-cms/conditional';
import { env } from '@game-cms/env';
import type {
  DatabaseCollectionId,
  DatabaseEntityMap,
  EntityData,
} from '@game-cms/types';
import { MongoClient } from 'mongodb';

import { service } from '../utils.js';

let _client: MongoClient | undefined;

function client(): MongoClient {
  if (_client === undefined) {
    const { url, ...rest } = env().config.database.mongo;

    _client = new MongoClient(url, rest);
  }

  return _client;
}

export default service({
  id: 'base::database',
  client,
  collection: <T extends DatabaseCollectionId>(id: T) => {
    return client().db().collection<DatabaseEntityMap[T]>(id);
  },
  entityCollection: <T extends EntityData>(id: string) => {
    return client()
      .db()
      .collection<EntityConditionalData<T>>(`base::entity::${id}`);
  },
});
