import {
  DependencyList,
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type NonValueDataState = { type: 'pending' | 'error' };

export type SuccessDataState<T> = { type: 'success'; readonly value: T };
export type DataState<T> = SuccessDataState<T> | NonValueDataState;

const PENDING: NonValueDataState = { type: 'pending' };
const ERROR: NonValueDataState = { type: 'error' };

type ResultArray<T> = [DataState<T>, () => void, Dispatch<T>];

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps: DependencyList = []
): ResultArray<T> {
  const [state, setState] = useState<DataState<T>>(PENDING);

  const setResult = useCallback((value: T) => {
    setState({ type: 'success', value });
  }, []);

  const doLoad = useCallback(() => {
    setState(PENDING);

    loader()
      .then(setResult)
      .catch((error: unknown) => {
        console.error(error);

        setState(ERROR);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(doLoad, [doLoad]);

  return useMemo(() => [state, doLoad, setResult], [state, doLoad, setResult]);
}
