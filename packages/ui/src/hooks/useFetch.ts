import {
  createAbortController,
  type MaybePromise,
  type QueryResult,
} from '@game-cms/shared';

import { useAbstractQueryResult } from './useAbstractQueryResult';

export function useFetch<T>(
  url: string,
  resolver: (response: Response) => MaybePromise<T>
): QueryResult<T> {
  return useAbstractQueryResult(() => {
    const abortController = createAbortController();

    const promise = fetch(url, {
      signal: abortController?.signal,
    }).then(resolver);

    return {
      promise,
      abort: () => {
        abortController?.abort();
      },
    };
  }, [resolver, url]);
}

const textResolver = (response: Response) => response.text();
const jsonResolver = (response: Response) => response.json();

export function useTextFetch(url: string) {
  return useFetch(url, textResolver);
}

export function useJsonFetch(url: string) {
  return useFetch(url, jsonResolver);
}
