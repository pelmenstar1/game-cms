import { describe, expect, test } from 'vitest';

import { withEnding } from './ending.js';

describe('withEnding', () => {
  test('none', () => {
    expect(withEnding('123')).toEqual('123');
  });

  test('ellipsis', () => {
    expect(withEnding('123', 'ellipsis')).toEqual('123…');
  });
});
