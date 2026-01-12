import {
  createAbortController,
  type MaybePromise,
  pendingQueryResult,
  type QueryResult,
} from '@game-cms/shared';
import { useEffect, useState } from 'react';

export function useFetch<T>(
  url: string,
  resolver: (response: Response) => MaybePromise<T>
): QueryResult<T> {
  const [result, setResult] = useState(pendingQueryResult<T>());

  useEffect(() => {
    const abortController = createAbortController();

    fetch(url, {
      signal: abortController?.signal,
    })
      .then(resolver)
      .then((value) => {
        setResult({ status: 'success', value });
      })
      .catch((error: unknown) => {
        console.error(error);

        setResult({ status: 'error', error });
      });

    return () => {
      abortController?.abort();
    };
  }, [resolver, url]);

  return result;
}

const textResolver = (response: Response) => response.text();
const jsonResolver = (response: Response) => response.json();

export function useTextFetch(url: string) {
  return useFetch(url, textResolver);
}

export function useJsonFetch(url: string) {
  return useFetch(url, jsonResolver);
}
