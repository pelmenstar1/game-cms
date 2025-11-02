import type { DatabaseInit } from 'game-cms';

export const config: DatabaseInit = (env) => ({
  mongo: {
    url: 'http://localhost:27017',
    connectionString: env('MONGO_CONNECTION_STRING'),
    auth: {
      username: 'admin',
      password: 'password',
    },
  },
});
