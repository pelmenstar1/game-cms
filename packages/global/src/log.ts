import type { Logger } from 'pino';

let logger: Logger | undefined;

export function log() {
  if (logger === undefined) {
    throw new Error('Logger is undefined');
  }

  return logger;
}

export function setLogger(value: Logger) {
  logger = value;
}
