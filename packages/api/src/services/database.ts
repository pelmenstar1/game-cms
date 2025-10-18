import { MongoClient } from 'mongodb';
import { service } from '../utils.js';
import { env } from '@game-cms/env';

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
});
