import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

const parsePageNumber = (searchParams: URLSearchParams) => {
  const value = searchParams.get('page');

  if (value) {
    const numberValue = Number.parseInt(value);

    if (!Number.isNaN(numberValue)) {
      return numberValue;
    }
  }

  return 1;
};

export const useQueryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => parsePageNumber(searchParams));

  const setPageWithUrl = useCallback(
    (value: number) => {
      setPage(value);
      setSearchParams((params) => {
        const result = new URLSearchParams(params);
        result.set('page', value.toString());

        return result;
      });
    },
    [setSearchParams]
  );

  return useMemo(() => [page, setPageWithUrl] as const, [page, setPageWithUrl]);
};
