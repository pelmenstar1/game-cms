export interface RequestInitWithHeaders extends RequestInit {
  headers: Headers;
}

export type RequestInitializer = (init: RequestInitWithHeaders) => void;

export function jsonInit(body: unknown): RequestInitializer {
  return (init) => {
    init.body = JSON.stringify(body);
    init.headers.set('Content-Type', 'application/json');
  };
}
