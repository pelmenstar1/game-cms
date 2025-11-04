export type ResponseParser<T = unknown> = (response: Response) => Promise<T>;

const _json = (response: Response) => response.json();

export function json<T>(): ResponseParser<T> {
  return _json;
}
