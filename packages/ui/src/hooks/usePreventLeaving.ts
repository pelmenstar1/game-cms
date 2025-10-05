import { useEffect } from 'react';

import { addNativeEventListener } from './nativeEventListener';

export function usePreventLeaving(enabled: boolean = true) {
  useEffect(() => {
    if (enabled) {
      return addNativeEventListener(window, 'beforeunload', (event) => {
        event.preventDefault();

        // For old browsers.
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        event.returnValue = true;
      });
    }
  });
}
