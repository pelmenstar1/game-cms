import { type RefObject, useEffect, useState } from 'react';

type Rect = { left: number; top: number; width: number; height: number };

const INITIAL_RECT: Rect = { left: 0, top: 0, width: 0, height: 0 };

export function useBounds<T extends Element>(ref: RefObject<T | null>) {
  const [result, setResult] = useState(INITIAL_RECT);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      setResult(element.getBoundingClientRect());

      const observer = new ResizeObserver(([entry]) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (entry !== undefined) {
          setResult(entry.target.getBoundingClientRect());
        }
      });

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return result;
}
