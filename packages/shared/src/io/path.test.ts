import { describe, expect, it } from 'vitest';

import { removeExtension } from './path.js';

describe('removeExtension', () => {
  it('should remove extension', () => {
    expect(removeExtension('file.txt')).toBe('file');
    expect(removeExtension('path/to/file.txt')).toBe('path/to/file');
    expect(removeExtension('file.test.ts')).toBe('file.test');
  });

  it('should handle no extension', () => {
    expect(removeExtension('README')).toBe('README');
  });
});
