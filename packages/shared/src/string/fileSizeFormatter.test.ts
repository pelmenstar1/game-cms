import { expect, test } from 'vitest';

import { formatFileSize } from './fileSizeFormatter.js';

test.each([
  [1, '1 B'],
  [100, '100 B'],
  [1024, '1 KB'],
  [1025, '1 KB'],
  [2048, '2 KB'],
  [2548, '2.49 KB'],
  [1024 * 1024, '1 MB'],
])('formatFileSize', (size, expected) => {
  const actual = formatFileSize(size);

  expect(actual).toEqual(expected);
});
