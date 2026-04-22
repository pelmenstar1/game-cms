import { describe, expect, test } from 'vitest';

import { Bitmap } from './Bitmap.js';

describe('Bitmap', () => {
  describe('get', () => {
    test('returns false for all indices on a fresh bitmap', () => {
      const bitmap = new Bitmap(64);

      for (let i = 0; i < 64; i++) {
        expect(bitmap.get(i)).toBe(false);
      }
    });

    test('returns true only for the set index', () => {
      const bitmap = new Bitmap(10);
      bitmap.set(5);
      expect(bitmap.get(5)).toBe(true);

      for (let i = 0; i < 10; i++) {
        if (i !== 5) expect(bitmap.get(i)).toBe(false);
      }
    });
  });

  describe('set', () => {
    test('sets multiple indices independently', () => {
      const bitmap = new Bitmap(100);
      bitmap.set(0);
      bitmap.set(31);
      bitmap.set(32);
      bitmap.set(99);

      expect(bitmap.get(0)).toBe(true);
      expect(bitmap.get(31)).toBe(true);
      expect(bitmap.get(32)).toBe(true);
      expect(bitmap.get(99)).toBe(true);
    });

    test('setting an already-set index is idempotent', () => {
      const bitmap = new Bitmap(10);
      bitmap.set(3);
      bitmap.set(3);
      expect(bitmap.get(3)).toBe(true);
    });

    test('does not affect neighboring bits across word boundaries', () => {
      const bitmap = new Bitmap(64);
      bitmap.set(31);
      bitmap.set(32);

      expect(bitmap.get(30)).toBe(false);
      expect(bitmap.get(33)).toBe(false);
    });
  });

  describe('word boundary behavior', () => {
    test.each<[number]>([[0], [31], [32], [63], [64], [127]])(
      'correctly handles index %i spanning word boundaries',
      (index) => {
        const bitmap = new Bitmap(128);
        bitmap.set(index);

        expect(bitmap.get(index)).toBe(true);
      }
    );
  });

  describe('size = 1', () => {
    test('works for a single-bit bitmap', () => {
      const bitmap = new Bitmap(1);
      expect(bitmap.get(0)).toBe(false);

      bitmap.set(0);
      expect(bitmap.get(0)).toBe(true);
    });
  });
});
