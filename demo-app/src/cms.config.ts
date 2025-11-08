import { localStorageProvider } from '@game-cms/storage-provider-local';
import { config } from 'game-cms';

export default config((env) => ({
  auth: {
    jwtSignKey: env('JWT_SECRET_KEY'),
    admin: {
      email: 'admin@demo.app',
      password: 'admin',
    },
  },
  database: {
    mongo: {
      url: 'mongodb://localhost:27017',
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
