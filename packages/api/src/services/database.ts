import type { EntityConditionalDataById } from '@game-cms/conditional';
import { env } from '@game-cms/env';
import type {
  DatabaseCollectionId,
  DatabaseEntityMap,
  EntityId,
} from '@game-cms/types';
import { service } from '@game-cms/utils';
import { MongoClient } from 'mongodb';

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
  entityCollection: <T extends EntityId>(id: T) => {
    return client()
      .db()
      .collection<EntityConditionalDataById<T>>(`base::entity::${id}`);
  },
});
