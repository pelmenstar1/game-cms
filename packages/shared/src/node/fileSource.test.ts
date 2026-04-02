import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { Readable } from 'node:stream';

import { describe, expect, test } from 'vitest';

import {
  type FileSource,
  writeFileSourceToFile,
  writeFileSourceToNewFile,
} from './fileSource.js';
import { httpCloseAsync, httpGetAsync, httpListenAsync } from './http.js';
import { temporalDirectory } from './tempDir.js';

const EXPECTED = Buffer.from('hello world');

async function writeAndVerify(source: FileSource, expected: Buffer) {
  await using dir = await temporalDirectory();
  const filePath = path.join(dir.path, 'output.bin');

  const size = await writeFileSourceToFile(source, filePath);
  const written = await fsp.readFile(filePath);

  expect(written.equals(expected)).toBe(true);
  expect(size).toBe(expected.length);
}

async function retryAndVerify(source: FileSource, expected: Buffer) {
  await using dir = await temporalDirectory();

  const existingPath = path.join(dir.path, 'existing.bin');
  await fsp.writeFile(existingPath, 'occupied');

  let callCount = 0;

  const { filePath, size } = await writeFileSourceToNewFile(source, () => {
    callCount++;
    if (callCount === 1) return existingPath;
    return path.join(dir.path, 'new.bin');
  });

  expect(callCount).toBe(2);
  expect(filePath).toBe(path.join(dir.path, 'new.bin'));
  expect(size).toBe(expected.length);

  const written = await fsp.readFile(filePath);
  expect(written.equals(expected)).toBe(true);

  // original file should be unchanged
  const original = await fsp.readFile(existingPath, 'utf8');
  expect(original).toBe('occupied');
}

describe('writeFileSourceToFile', () => {
  test('buffer', async () => {
    await writeAndVerify(EXPECTED, EXPECTED);
  });

  test.each([
    [[EXPECTED]],
    [[Buffer.from('aaa'), Buffer.from('bbb'), Buffer.from('c')]],
  ])('Readable.from stream', async (chunks) => {
    await writeAndVerify(Readable.from(chunks), Buffer.concat(chunks));
  });

  test('file read stream', async () => {
    await using dir = await temporalDirectory();
    const srcPath = path.join(dir.path, 'source.txt');
    await fsp.writeFile(srcPath, EXPECTED);

    const stream = fs.createReadStream(srcPath);

    await writeAndVerify(stream, EXPECTED);
  });

  test('http response stream', async () => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200);
      res.end(EXPECTED);
    });

    await httpListenAsync(server, 0);

    const address = server.address() as { port: number };

    try {
      const stream = await httpGetAsync(`http://127.0.0.1:${address.port}`);

      await writeAndVerify(stream, EXPECTED);
    } finally {
      await httpCloseAsync(server);
    }
  });
});

describe('writeFileSourceToNewFile', () => {
  test('writes buffer to new file', async () => {
    await using dir = await temporalDirectory();

    const { filePath, size } = await writeFileSourceToNewFile(EXPECTED, () =>
      path.join(dir.path, 'output.bin')
    );

    const written = await fsp.readFile(filePath);

    expect(written.equals(EXPECTED)).toBe(true);
    expect(size).toBe(EXPECTED.length);
  });

  test('writes stream to new file', async () => {
    await using dir = await temporalDirectory();

    const { filePath, size } = await writeFileSourceToNewFile(
      Readable.from([EXPECTED]),
      () => path.join(dir.path, 'output.bin')
    );

    const written = await fsp.readFile(filePath);

    expect(written.equals(EXPECTED)).toBe(true);
    expect(size).toBe(EXPECTED.length);
  });

  test('throws non-EEXIST errors', async () => {
    const nonExistentDir = path.join('/tmp', `does-not-exist-${Date.now()}`);

    await expect(
      writeFileSourceToNewFile(EXPECTED, () =>
        path.join(nonExistentDir, 'file.bin')
      )
    ).rejects.toThrow();
  });

  test('retries with buffer when file already exists', async () => {
    await retryAndVerify(EXPECTED, EXPECTED);
  });

  test('retries with stream when file already exists', async () => {
    await retryAndVerify(Readable.from([EXPECTED]), EXPECTED);
  });
});
