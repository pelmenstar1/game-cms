import { describe, expect, it } from 'vitest';

import { formatSearchParams } from './searchParams.js';

describe('formatSearchParams', () => {
  it('should format various types', () => {
    expect(formatSearchParams({ str: 'value', num: 123, bool: true })).toBe(
      'str=value&num=123&bool=true'
    );
  });

  it('should handle null and undefined', () => {
    expect(formatSearchParams({ a: null, b: undefined })).toBe('a=null');
  });

  it('should handle empty object', () => {
    expect(formatSearchParams({})).toBe('');
  });
});
