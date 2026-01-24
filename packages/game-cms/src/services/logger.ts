import type { LoggerOptions } from 'pino';
import pino from 'pino';

const envToLoggerOptions: Record<string, LoggerOptions> = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
};

export function createLogger() {
  const env = process.env.NODE_ENV ?? 'development';
  const options = envToLoggerOptions[env];

  return pino(options);
}
