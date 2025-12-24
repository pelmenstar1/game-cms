import fastify from 'fastify';

import { envToLogger } from './logger.js';

export function createFastifyApp() {
  const envType = process.env.NODE_ENV ?? 'development';

  return fastify({
    logger: envToLogger[envType] ?? envToLogger.development,
  });
}
