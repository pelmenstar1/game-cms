import { describe, expect, test } from 'vitest';

import { inferFileExtensionFromMime, removeExtension } from './path.js';

describe('removeExtension', () => {
  test('should remove extension', () => {
    expect(removeExtension('file.txt')).toBe('file');
    expect(removeExtension('path/to/file.txt')).toBe('path/to/file');
    expect(removeExtension('file.test.ts')).toBe('file.test');
  });

  test('should handle no extension', () => {
    expect(removeExtension('README')).toBe('README');
  });
});

describe('inferFileExtensionFromMime', () => {
  test('returns extension from mime type', () => {
    const result = inferFileExtensionFromMime('image/png', 'photo.jpg');

    expect(result).toBe('.png');
  });

  test('falls back to original name extension when mime is unknown', () => {
    const result = inferFileExtensionFromMime(
      'application/octet-stream',
      'model.glb'
    );

    expect(result).toBe('.glb');
  });

  test('returns empty string when no extension can be resolved', () => {
    const result = inferFileExtensionFromMime('application/x-unknown', 'noext');

    expect(result).toBe('');
  });
});
