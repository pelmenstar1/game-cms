import { gamePlugin } from '@game-cms/game-plugin';
import { localStorageProvider } from '@game-cms/storage-provider-local';
import { config } from 'game-cms';

export default config((env) => ({
  plugins: [gamePlugin],
  auth: {
    jwtSignKey: env('JWT_SECRET_KEY'),
    admin: {
      email: 'admin@demo.app',
      password: 'admin',
    },
  },
  database: {
    mongo: {
      url: 'mongodb://mongodb:27017',
      auth: {
        username: 'admin',
        password: 'password',
      },
    },
  },
  server: {
    port: 3000,
  },
  storage: {
    provider: localStorageProvider(),
  },
}));
