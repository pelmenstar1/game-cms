import type { MaybeArray } from './collections/maybeArray.js';

export type SearchParamAtom = string | number | boolean | null | undefined;

export type SearchParams = Record<string, MaybeArray<SearchParamAtom>>;

function putItem(result: URLSearchParams, key: string, value: unknown) {
  if (value !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    result.append(key, value?.toString() ?? 'null');
  }
}

export function formatSearchParams(params: SearchParams): string {
  const result = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        putItem(result, key, item);
      }
    } else {
      putItem(result, key, value);
    }
  }

  return result.toString();
}
