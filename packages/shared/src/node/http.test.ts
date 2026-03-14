import http from 'node:http';
import type { AddressInfo } from 'node:net';

import { describe, expect, test } from 'vitest';

import { addressInfoToHttpUrl, httpCloseAsync, httpGetAsync } from './http.js';

function testAddressFamily(host: string, expectedFamily: string) {
  test(`produces a reachable ${expectedFamily} url`, async () => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200);
      res.end('ok');
    });

    await new Promise<void>((resolve) => server.listen(0, host, resolve));

    try {
      const info = server.address() as AddressInfo;
      expect(info.family).toBe(expectedFamily);

      const url = addressInfoToHttpUrl(info);
      const res = await httpGetAsync(url);

      expect(res.statusCode).toBe(200);
    } finally {
      await httpCloseAsync(server);
    }
  });
}

describe('addressInfoToHttpUrl', () => {
  describe('IPv4', () => {
    testAddressFamily('127.0.0.1', 'IPv4');
  });

  describe('IPv6', () => {
    testAddressFamily('::1', 'IPv6');
  });
});
