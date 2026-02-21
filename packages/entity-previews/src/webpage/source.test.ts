import http from 'node:http';

import { httpCloseAsync, httpListenAsync } from '@game-cms/shared/node';
import { describe, expect, test } from 'vitest';

import { postRequestUrlSource } from './source.js';

async function createJsonServer(body: unknown) {
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  });

  await httpListenAsync(server, 0);
  const { port } = server.address() as { port: number };

  return {
    url: `http://127.0.0.1:${port}`,
    [Symbol.asyncDispose]: async () => {
      await httpCloseAsync(server);
    },
  };
}

describe('postRequestUrlSource', () => {
  test('parses url from response body', async () => {
    const expectedUrl = 'https://example.com/preview/123';

    await using server = await createJsonServer({ url: expectedUrl });

    const source = postRequestUrlSource(server.url);
    const result = await source({
      entityId: 'test',
      data: {},
    });

    expect(result).toBe(expectedUrl);
  });

  test('throws on non-object response body', async () => {
    await using server = await createJsonServer('just a string');

    const source = postRequestUrlSource(server.url);

    await expect(source({ entityId: 'test', data: {} })).rejects.toThrow(
      'not an object'
    );
  });

  test('throws when url field is missing', async () => {
    await using server = await createJsonServer({ notUrl: 'value' });

    const source = postRequestUrlSource(server.url);

    await expect(source({ entityId: 'test', data: {} })).rejects.toThrow(
      'expected a string field "url"'
    );
  });

  test('throws on non-ok response', async () => {
    const server = http.createServer((_req, res) => {
      res.writeHead(500);
      res.end('Internal Server Error');
    });

    await httpListenAsync(server, 0);
    const { port } = server.address() as { port: number };

    try {
      const source = postRequestUrlSource(`http://127.0.0.1:${port}`);

      await expect(source({ entityId: 'test', data: {} })).rejects.toThrow(
        'Cannot fetch'
      );
    } finally {
      await httpCloseAsync(server);
    }
  });
});
