import type { Logger } from 'pino';

const store = globalThis as unknown as Record<string, unknown>;
const KEY = '__game_cms_logger__';

export function log() {
  const value = store[KEY] as Logger | undefined;
  if (value === undefined) {
    throw new Error('Logger is undefined');
  }

  return value;
}

export function setLogger(value: Logger) {
  store[KEY] = value;
}
