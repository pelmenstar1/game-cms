import type { FastifyLoggerOptions } from 'fastify';
import type { LoggerOptions } from 'pino';

export const envToLogger: Record<
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
