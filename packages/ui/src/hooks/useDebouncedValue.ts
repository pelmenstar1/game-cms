import { useEffect, useRef, useState } from 'react';

export function useDebouncedValue<T>(currentValue: T, timeInMs: number) {
  const [stableValue, setStableValue] = useState(currentValue);

  const timeInMsRef = useRef(timeInMs);

  // eslint-disable-next-line react-hooks/refs
  timeInMsRef.current = timeInMs;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStableValue(currentValue);
    }, timeInMsRef.current);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentValue]);

  return stableValue;
}
