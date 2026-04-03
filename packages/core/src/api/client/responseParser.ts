export type ResponseParser<T = unknown> = (response: Response) => Promise<T>;

export type JsonParserValidator<T> = (data: unknown) => T;

export type JsonParserOptions<T> = {
  validator?: JsonParserValidator<T>;
};

const _json = (response: Response) => response.json();

export function json<T>(options?: JsonParserOptions<T>): ResponseParser<T> {
  const validator = options?.validator;
  if (!validator) {
    return _json;
  }

  return async (response) => {
    const data: unknown = await response.json();

    return validator(data);
  };
}

const _text = (response: Response) => response.text();

export function text(): ResponseParser<string> {
  return _text;
}
