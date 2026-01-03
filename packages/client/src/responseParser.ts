import type { ResponseParser } from '@game-cms/core';

const _json = (response: Response) => response.json();

export function json<T>(): ResponseParser<T> {
  return _json;
}
