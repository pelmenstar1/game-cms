import { afterAll, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useInterval } from './useInterval';

test('should cleanup pending timer', () => {
  vi.stubGlobal('setInterval', vi.fn());
  vi.stubGlobal('clearInterval', vi.fn());

  const { act, unmount } = renderHook(() => {
    useInterval(1000, () => {});
  });

  act(() => {
    expect(setInterval).toHaveBeenCalledOnce();
  });

  unmount();

  expect(clearInterval).toHaveBeenCalledOnce();

  afterAll(() => {
    vi.clearAllMocks();
  });
});
