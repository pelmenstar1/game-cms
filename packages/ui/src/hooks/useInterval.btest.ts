import { afterAll, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useInterval } from './useInterval';

test('should cleanup pending timer', async () => {
  vi.stubGlobal('setInterval', vi.fn());
  vi.stubGlobal('clearInterval', vi.fn());

  const { act, unmount } = await renderHook(() => {
    useInterval(1000, () => {});
  });

  await act(() => {
    expect(setInterval).toHaveBeenCalledOnce();
  });

  await unmount();

  expect(clearInterval).toHaveBeenCalledOnce();

  afterAll(() => {
    vi.clearAllMocks();
  });
});
