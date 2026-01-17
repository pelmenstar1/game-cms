import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useScrollbar } from './useScrollbar';

function expectOverflowY(value: string) {
  expect(document.body.style.overflowY).toBe(value);
}

test('enabled/true', async () => {
  const { act, unmount } = await renderHook(() => {
    useScrollbar(true);
  });

  await act(() => {
    expectOverflowY('auto');
  });

  await unmount();
  expectOverflowY('auto');
});

test('enabled/false', async () => {
  const { act, unmount } = await renderHook(() => {
    useScrollbar(false);
  });

  await act(() => {
    expectOverflowY('hidden');
  });

  await unmount();
  expectOverflowY('auto');
});
