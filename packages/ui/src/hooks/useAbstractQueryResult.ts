import {
  isPromise,
  pendingQueryResult,
  type QueryResult,
} from '@game-cms/shared';
import { useEffect, useState } from 'react';

type AbstractQueryResultDescriptor<T> = {
  promise: Promise<T>;
  cleanup?: () => void;
};

type AbstractQueryResultFactory<T> = () =>
  | Promise<T>
  | AbstractQueryResultDescriptor<T>;

export function useAbstractQueryResult<T>(
  factory: AbstractQueryResultFactory<T>,
  deps?: unknown[]
) {
  const [result, setResult] = useState<QueryResult<T>>(pendingQueryResult());

  useEffect(() => {
    setResult(pendingQueryResult());

    const descriptor = factory();

    let cleanup: (() => void) | undefined;
    let promise: Promise<T>;

    if (isPromise(descriptor)) {
      promise = descriptor;
    } else {
      promise = descriptor.promise;
      cleanup = descriptor.cleanup;
    }

    promise
      .then((value) => {
        setResult({ status: 'success', value });
      })
      .catch((error: unknown) => {
        console.error(error);

        setResult({ status: 'error', error });
      });

    return cleanup;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}
