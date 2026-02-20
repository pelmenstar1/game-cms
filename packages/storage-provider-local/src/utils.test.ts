import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { Readable } from 'node:stream';

import {
  httpCloseAsync,
  httpGetAsync,
  httpListenAsync,
} from '@game-cms/shared/node';
import { temporalDirectory } from '@game-cms/shared/node/io';
import { describe, expect, test } from 'vitest';

import { writeFileSourceToFile } from './utils.js';

const EXPECTED = Buffer.from('hello world');

async function writeAndVerify(source: Readable | Uint8Array, expected: Buffer) {
  await using dir = await temporalDirectory();
  const filePath = path.join(dir.path, 'output.bin');

  const size = await writeFileSourceToFile(source, filePath);
  const written = await fsp.readFile(filePath);

  expect(written.equals(expected)).toBe(true);
  expect(size).toBe(expected.length);
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
