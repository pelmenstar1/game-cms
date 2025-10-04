import type { DatabaseInit } from 'game-cms';

export const config: DatabaseInit = (env) => ({
  mongo: {
    connectionString: env('MONGO_CONNECTION_STRING'),
  },
});
