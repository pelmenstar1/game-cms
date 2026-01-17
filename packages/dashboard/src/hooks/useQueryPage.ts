import { useMemo } from 'react';
import { type Location, useLocation } from 'react-router';

const parsePageNumber = (location: Location) => {
  const value = new URLSearchParams(location.search).get('page');

  if (value) {
    const numberValue = Number.parseInt(value);

    if (!Number.isNaN(numberValue) && numberValue > 0) {
      return numberValue;
    }
  }

  return 1;
};

export const useQueryPage = () => {
  const location = useLocation();

  return useMemo(() => parsePageNumber(location), [location]);
};
