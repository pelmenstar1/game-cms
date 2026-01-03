import { type RequestInitializer } from '@game-cms/core';

export function jsonInit(body: unknown): RequestInitializer {
  return (init) => {
    init.body = JSON.stringify(body);
    init.headers.set('Content-Type', 'application/json');
  };
}
