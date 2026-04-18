import { review } from '@game-cms/entity-checks';
import { gamePlugin } from '@game-cms/game-plugin';
import { imageSize, responsiveImages } from '@game-cms/storage-addons';
import { s3StorageProvider } from '@game-cms/storage-provider-s3';
import { config, entityHook, entityWebhookHandler } from 'game-cms';

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
    provider: s3StorageProvider({
      bucket: env('S3_BUCKET'),
      client: {
        endpoint: env('S3_API_URL'),
        region: 'auto',
        credentials: {
          accessKeyId: env('S3_ACCESS_KEY_ID'),
          secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
        },
      },
    }),
    addons: [imageSize(), responsiveImages({ breakpoints: [320, 420] })],
  },
  entity: {
    checks: { config: { captureStackTrace: false }, items: [review()] },
    hooks: [
      entityHook({
        target: 'test',
        on: ['created', 'updated'],
        handler: entityWebhookHandler({
          url: 'http://localhost:3333/entity-webhook',
        }),
      }),
    ],
  },
}));
