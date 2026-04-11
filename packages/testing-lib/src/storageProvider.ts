/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Readable } from 'node:stream';

import { AnyStorageProvider, StorageProvider } from '@game-cms/base-core';
import { MaybePromise } from '@game-cms/shared';
import { FileSource } from '@game-cms/shared/node';
import { describe, expect, test } from 'vitest';

interface StorageProviderResult<
  Provider = AnyStorageProvider,
> extends AsyncDisposable {
  value: Provider;
}

type InferProviderExtra<T extends StorageProviderResult> =
  T['value'] extends StorageProvider<infer Extra> ? Extra : never;

type StorageProviderTestsOptions<Result extends StorageProviderResult> = {
  disallowNonExistingPatch?: boolean;

  createProvider: () => MaybePromise<Result>;
  nonExistingExtra: () => InferProviderExtra<Result>;
  exists: (
    provider: Result,
    extra: InferProviderExtra<Result>
  ) => Promise<boolean>;
};

export function setupStorageProviderTests<Result extends StorageProviderResult>(
  options: StorageProviderTestsOptions<Result>
) {
  const { createProvider, exists, nonExistingExtra, disallowNonExistingPatch } =
    options;

  async function uploadAndCheckContent(content: FileSource, expected: Buffer) {
    await using provider = await createProvider();

    const { extra, size } = await provider.value.protocol.upload({
      name: '123',
      mime: 'text/plain',
      content,
    });

    const actual = await provider.value.protocol.getContent(extra);

    expect(
      Buffer.from(actual).equals(expected),
      `actual: ${Buffer.from(actual).toString('hex')}; expected: ${expected.toString('hex')}`
    ).toEqual(true);

    expect(size).toEqual(expected.length);
  }

  function fileSourceTests(
    fn: (transformer: (content: Buffer) => FileSource) => Promise<void>
  ) {
    test('buffer', async () => {
      await fn((content) => content);
    });

    test('stream', async () => {
      await fn((content) => Readable.from([content]));
    });
  }

  describe('uploadFile', () => {
    fileSourceTests(async (transformer) => {
      const expected = Buffer.from('123');

      await uploadAndCheckContent(transformer(expected), expected);
    });
  });

  describe('deleteMany', () => {
    test('should delete multiple existing files and return true for each', async () => {
      await using provider = await createProvider();

      const protocol = provider.value.protocol;

      if (!protocol.deleteMany) {
        return;
      }

      const { extra: extra1 } = await protocol.upload({
        name: 'file1',
        mime: 'text/plain',
        content: Buffer.from('a'),
      });
      const { extra: extra2 } = await protocol.upload({
        name: 'file2',
        mime: 'text/plain',
        content: Buffer.from('b'),
      });

      const { deletedStatuses } = await protocol.deleteMany([extra1, extra2]);

      expect(deletedStatuses).toEqual([{ value: true }, { value: true }]);

      expect(await exists(provider, extra1)).toBe(false);
      expect(await exists(provider, extra2)).toBe(false);
    });

    test('should return true for non-existing file', async () => {
      await using provider = await createProvider();

      const protocol = provider.value.protocol;

      if (!protocol.deleteMany) return;

      const { extra: existing } = await protocol.upload({
        name: 'file1',
        mime: 'text/plain',
        content: Buffer.from('a'),
      });
      const nonExisting = nonExistingExtra();

      const { deletedStatuses } = await protocol.deleteMany([
        existing,
        nonExisting,
      ]);

      expect(deletedStatuses).toEqual([{ value: true }, { value: true }]);
      expect(await exists(provider, existing)).toBe(false);
    });

    test('should return empty statuses for empty array', async () => {
      await using provider = await createProvider();

      const protocol = provider.value.protocol;

      if (!protocol.deleteMany) {
        return;
      }

      const { deletedStatuses } = await protocol.deleteMany([]);

      expect(deletedStatuses).toEqual([]);
    });
  });

  describe('delete', () => {
    test('should delete file if exists', async () => {
      await using provider = await createProvider();

      const protocol = provider.value.protocol;

      const { extra } = await protocol.upload({
        name: '123',
        mime: 'text/plain',
        content: Buffer.from('123'),
      });

      expect(await exists(provider, extra)).toEqual(true);

      await protocol.delete(extra);

      expect(await exists(provider, extra)).toEqual(false);
    });

    test('should not throw if file does not exist', async () => {
      await using provider = await createProvider();

      const extra = nonExistingExtra();

      await expect(
        provider.value.protocol.delete(extra)
      ).resolves.not.toThrow();
    });
  });

  test('getContent', async () => {
    await using provider = await createProvider();
    const protocol = provider.value.protocol;

    const expected = Buffer.from('123');

    const { extra } = await protocol.upload({
      name: '123',
      mime: 'text/plain',
      content: expected,
    });

    const actual = await protocol.getContent(extra);

    expect(expected.equals(actual)).toEqual(true);
  });

  describe('patchContent', () => {
    describe('file exists', () => {
      fileSourceTests(async (transformer) => {
        await using provider = await createProvider();
        const protocol = provider.value.protocol;

        const initial = Buffer.from('initial');
        const { extra } = await protocol.upload({
          name: 'patch-test',
          mime: 'text/plain',
          content: transformer(initial),
        });

        const patched = Buffer.from('patched');
        const { size } = await protocol.patchContent({
          extra,
          mime: 'text/plain',
          content: transformer(patched),
        });

        const actual = await protocol.getContent(extra);

        expect(patched.equals(actual)).toEqual(true);
        expect(size).toEqual(patched.length);
      });
    });

    if (disallowNonExistingPatch) {
      describe('file does not exist', () => {
        fileSourceTests(async (transformer) => {
          await using provider = await createProvider();

          const extra = nonExistingExtra();
          const patched = Buffer.from('patched');

          await expect(
            provider.value.protocol.patchContent({
              extra,
              mime: 'text/plain',
              content: transformer(patched),
            })
          ).rejects.toThrow();
        });
      });
    }
  });
}
