export type ResponseParser<T = unknown> = (response: Response) => Promise<T>;

export function json<T>(): ResponseParser<T> {
  return (response) => response.json();
}
