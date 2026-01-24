import type {
  DatabaseCollectionId,
  DatabaseEntityMap,
  EntityDataVariantsById,
  EntityId,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import {
  ClientSession,
  CommandFailedEvent,
  CommandStartedEvent,
  CommandSucceededEvent,
  MongoClient,
  type TransactionOptions,
} from 'mongodb';

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::database::commandStarted': CommandStartedEvent;
    'base::database::commandSucceeded': CommandSucceededEvent;
    'base::database::commandFailed': CommandFailedEvent;
  }
}

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
  lifecycle: {
    onInit: () => {
      const appEvents = cms().service('base::appEvents');

      client().on('commandStarted', (event) => {
        appEvents.emit('base::database::commandStarted', event);
      });

      client().on('commandSucceeded', (event) => {
        appEvents.emit('base::database::commandSucceeded', event);
      });

      client().on('commandFailed', (event) => {
        appEvents.emit('base::database::commandFailed', event);
      });
    },
  },
  client,
  collection: <T extends DatabaseCollectionId>(id: T) => {
    return client().db().collection<DatabaseEntityMap[T]>(id);
  },
  entityCollection: <Id extends EntityId>(id: Id) => {
    return client()
      .db()
      .collection<EntityDataVariantsById<Id>>(`base::entity::${id}`);
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
  close: async () => {
    await client().close();
  },
});
