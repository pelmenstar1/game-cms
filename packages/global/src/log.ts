import type { Logger } from 'pino';

declare global {
  var __game_cms_logger__: Logger | undefined;
}

const store = globalThis;
const KEY = '__game_cms_logger__';

export function log() {
  const value = globalThis[KEY];
  if (value === undefined) {
    throw new Error('Logger is undefined');
  }

  return value;
}

export function setLogger(value: Logger) {
  store[KEY] = value;
}
