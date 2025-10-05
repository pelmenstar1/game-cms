import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useScrollbar } from './useScrollbar';

function expectOverlowY(value: string) {
  expect(document.body.style.overflowY).toBe(value);
}

test('enabled/true', () => {
  const { act, unmount } = renderHook(() => {
    useScrollbar(true);
  });

  act(() => {
    expectOverlowY('auto');
  });

  unmount();
  expectOverlowY('auto');
});

test('enabled/false', () => {
  const { act, unmount } = renderHook(() => {
    useScrollbar(false);
  });

  act(() => {
    expectOverlowY('hidden');
  });

  unmount();
  expectOverlowY('auto');
});
