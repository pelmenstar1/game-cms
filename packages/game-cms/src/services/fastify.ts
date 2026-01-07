import fastify, { type FastifyLoggerOptions } from 'fastify';
import type { LoggerOptions } from 'pino';

const envToLogger: Record<
  string,
  (LoggerOptions & FastifyLoggerOptions) | boolean
> = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
};

export function createFastifyApp() {
  const envType = process.env.NODE_ENV ?? 'development';

  return fastify({
    logger: envToLogger[envType] ?? envToLogger.development,
  });
}
