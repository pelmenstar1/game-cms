import type {
  DatabaseCollectionId,
  DatabaseEntityMap,
  EntityId,
  EntityStorageDataById,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { env } from '@game-cms/global';
import { ClientSession, MongoClient, type TransactionOptions } from 'mongodb';

let _client: MongoClient | undefined;

function client(): MongoClient {
  if (_client === undefined) {
    const { url, ...rest } = env().config.database.mongo;

    _client = new MongoClient(url, { ...rest, ignoreUndefined: true });
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
      .collection<EntityStorageDataById<T>>(`base::entity::${id}`);
  },
  withTransaction: async <R>(
    action: (session: ClientSession) => Promise<R>
  ) => {
    const session = client().startSession();

    const transactionOptions: TransactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    };

    try {
      return await session.withTransaction(
        () => action(session),
        transactionOptions
      );
    } finally {
      await session.endSession();
    }
  },
});
