import type { ResponseParser } from './client.js';

const _json = (response: Response) => response.json();

export function json<T>(): ResponseParser<T> {
  return _json;
}

const _text = (response: Response) => response.text();

export function text(): ResponseParser<string> {
  return _text;
}
