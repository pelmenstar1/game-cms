import {
  createAbortController,
  handleResponseError,
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

    const worker = async () => {
      const response = await fetch(url, { signal: abortController?.signal });
      if (!response.ok) {
        await handleResponseError(response, 'Cannot fetch');
      }

      return resolver(response);
    };

    return {
      promise: worker(),
      cleanup: () => {
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
