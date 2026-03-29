import path from 'node:path';

import { describe, expect, test } from 'vitest';

import {
  jsDefaultModuleImporter,
  tsDefaultModuleImporter,
} from '../moduleImporter.js';

function fixture(name: string) {
  return path.join(import.meta.dirname, 'fixtures', name);
}

describe('jsDefaultModuleImporter', () => {
  describe('accept', () => {
    test.each([
      ['module.js', true],
      ['module.ts', false],
      ['module.json', false],
      ['module', false],
    ])('%s -> %s', (filePath, expected) => {
      expect(jsDefaultModuleImporter.accept(filePath)).toBe(expected);
    });
  });

  describe('import', () => {
    test('returns default export of a .js module', async () => {
      const result = await jsDefaultModuleImporter.import(
        fixture('defaultExport.js')
      );
      expect(result).toEqual({ value: 'hello' });
    });

    test('throws for non-existent file', async () => {
      await expect(
        jsDefaultModuleImporter.import(fixture('nonExistent.js'))
      ).rejects.toThrow();
    });
  });
});

describe('tsDefaultModuleImporter', () => {
  describe('accept', () => {
    test.each([
      ['module.js', true],
      ['module.ts', true],
      ['module.json', false],
      ['module', false],
    ])('%s -> %s', (filePath, expected) => {
      const importer = tsDefaultModuleImporter(import.meta.url);
      expect(importer.accept(filePath)).toBe(expected);
    });
  });

  describe('import', () => {
    test('returns default export of a .js module', async () => {
      const importer = tsDefaultModuleImporter(import.meta.url);
      const result = await importer.import(fixture('defaultExport.js'));
      expect(result).toEqual({ value: 'hello' });
    });

    test('returns default export of a .ts module', async () => {
      const importer = tsDefaultModuleImporter(import.meta.url);
      // Import a known .ts file from the project
      const result = await importer.import(
        path.join(import.meta.dirname, '../buffer.ts')
      );
      expect(result).toBeDefined();
    });

    test('throws for non-existent file', async () => {
      const importer = tsDefaultModuleImporter(import.meta.url);
      await expect(
        importer.import(fixture('nonExistent.ts'))
      ).rejects.toThrow();
    });
  });
});
