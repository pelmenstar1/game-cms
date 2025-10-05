import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

type PageFetcher<T> = {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;

  hasMoreItems: boolean;
  onRequestNextPage: () => void;
};

export function usePageFetcher<T>(
  fetch: (page: number) => Promise<T[]>,
  onError: (error: unknown) => void
): PageFetcher<T> {
  const currentPageRef = useRef(1);
  const isRequestPending = useRef(false);

  const [items, setItems] = useState<T[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const onRequestNextPage = useCallback(() => {
    if (!isRequestPending.current) {
      isRequestPending.current = true;

      fetch(currentPageRef.current)
        .then((page) => {
          if (page.length === 0) {
            setHasMoreItems(false);
          } else {
            setItems((items) => [...items, ...page]);
          }

          currentPageRef.current++;
          isRequestPending.current = false;
        })
        .catch((error: unknown) => {
          onError(error);

          isRequestPending.current = false;
        });
    }
  }, [fetch, onError]);

  return useMemo(
    () => ({ items, setItems, hasMoreItems, onRequestNextPage }),
    [hasMoreItems, setItems, items, onRequestNextPage]
  );
}
