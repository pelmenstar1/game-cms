import { FastifyCorsOptions } from '@fastify/cors';

declare module '@game-cms/core' {
  interface ServerConfig {
    cors?: FastifyCorsOptions;
  }
}
