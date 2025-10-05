import { getTimeZoneOffset } from '@game-cms/shared/chrono';
import { useEffect, useRef } from 'react';

import { useInterval } from './useInterval';

export function useCurrentTime(
  intervalMs: number,
  timeZone: string,
  callback: (now: Date) => void
) {
  const timeZoneOffset = useRef<number | null>(null);

  useEffect(() => {
    // Get the offset once. Unlikely the timezone offset will ever change when user is on the website.
    timeZoneOffset.current = getTimeZoneOffset(new Date(), timeZone);
  }, [timeZone]);

  useInterval(intervalMs, () => {
    const offset = timeZoneOffset.current;

    if (offset !== null) {
      const now = Date.now() + offset;

      callback(new Date(now));
    }
  });
}
