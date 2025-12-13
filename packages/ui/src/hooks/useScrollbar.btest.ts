import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useScrollbar } from './useScrollbar';

function expectOverlowY(value: string) {
  expect(document.body.style.overflowY).toBe(value);
}

test('enabled/true', async () => {
  const { act, unmount } = await renderHook(() => {
    useScrollbar(true);
  });

  await act(() => {
    expectOverlowY('auto');
  });

  await unmount();
  expectOverlowY('auto');
});

test('enabled/false', async () => {
  const { act, unmount } = await renderHook(() => {
    useScrollbar(false);
  });

  await act(() => {
    expectOverlowY('hidden');
  });

  await unmount();
  expectOverlowY('auto');
});
