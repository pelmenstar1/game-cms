import { localStorageProvider } from '@game-cms/storage-provider-local';
import { config } from 'game-cms';

import { cmsPlugin } from './plugin.js';

export default config((env) => ({
  auth: {
    admin: {
      email: 'admin@demo.app',
      password: 'admin',
    },
    jwtSignKey: env('JWT_SECRET_KEY'),
  },
  database: {
    mongo: {
      url: env('MONGO_CONNECTION_URL', 'mongodb://localhost:27017'),
      auth: {
        username: env('MONGO_USERNAME', 'admin'),
        password: env('MONGO_PASSWORD', 'password'),
      },
    },
  },
  server: {
    port: 3000,
    cors: {
      origin: '*',
    },
  },
  storage: {
    provider: localStorageProvider({
      isPublic: true,
    }),
  },
  plugins: [cmsPlugin],
}));
