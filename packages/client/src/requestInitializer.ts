import type { RequestInitWithHeaders } from './internal/utilTypes.js';

export type RequestInitializer = (init: RequestInitWithHeaders) => void;

export function jsonInit(body: unknown): RequestInitializer {
  return (init) => {
    init.body = JSON.stringify(body);
    init.headers.set('Content-Type', 'application/json');
  };
}
