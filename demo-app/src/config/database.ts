import type { DatabaseInit } from 'game-cms';

export const config: DatabaseInit = () => ({
  mongo: {
    url: 'mongodb://localhost:27017',
    auth: {
      username: 'admin',
      password: 'password',
    },
  },
});
