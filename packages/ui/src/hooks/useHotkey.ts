import { combineActions } from '@game-cms/shared';
import { setEquals } from '@game-cms/shared/collections';
import { useEffect, useRef } from 'react';

import type { KeyboardKey } from '../utils/keyboard';
import { addNativeEventListener } from './nativeEventListener';

export function useHotkey(combination: KeyboardKey[], callback: () => void) {
  const pressedKeysRef = useRef(new Set<string>());

  useEffect(() => {
    return combineActions(
      addNativeEventListener(window, 'keydown', (event) => {
        const pressedKeys = pressedKeysRef.current;
        pressedKeys.add(event.key);

        if (setEquals(pressedKeys, combination)) {
          event.preventDefault();

          callback();
        }
      }),
      addNativeEventListener(window, 'keyup', (event) => {
        pressedKeysRef.current.delete(event.key);
      }),
      addNativeEventListener(window, 'blur', () => {
        pressedKeysRef.current.clear();
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...combination, callback]);
}
