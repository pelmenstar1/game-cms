import type {
  DatabaseCollectionId,
  DatabaseCollectionTypeMap,
  EntityId,
  EntityPersistentDocumentById,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env, log } from '@game-cms/global';
import {
  ClientSession,
  CommandFailedEvent,
  CommandStartedEvent,
  CommandSucceededEvent,
  Document,
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

function rawCollection<T extends Document>(name: string) {
  return client().db().collection<T>(name);
}

export default service({
  id: 'base::database',
  lifecycle: {
    onInit: async () => {
      const appEvents = cms().service('base::appEvents');

      log().info('Connecting to database');
      await client().connect();

      client().on('connectionCreated', (info) => {
        log().child({ info }).info('Connected to database');
      });

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
    onDestroy: async () => {
      if (_client) {
        log().info('Closing database connection');

        await _client.close();
      }
    },
  },
  client,
  rawCollection,
  collection: <T extends DatabaseCollectionId>(id: T) => {
    return rawCollection<DatabaseCollectionTypeMap[T]>(id);
  },
  entityCollection: <Id extends EntityId>(id: Id) => {
    return rawCollection<EntityPersistentDocumentById<Id>>(
      `base::entity::${id}`
    );
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
  isDatabaseEmpty: async () => {
    const cursor = client().db().listCollections(
      {},
      {
        nameOnly: true,
      }
    );

    return !(await cursor.hasNext());
  },
  dropDatabase: async () => {
    await client().db().dropDatabase();
  },
  close: async () => {
    await client().close();
  },
});
