import path from 'node:path';
import { fileURLToPath } from 'node:url';

import httpProxy from '@fastify/http-proxy';
import staticPlugin from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export function getFrontendDistributionPath() {
  const moduleRoot = import.meta
    .resolve('@demo-platformer/frontend/package.json');

  return path.join(path.dirname(fileURLToPath(moduleRoot)), './dist');
}

export async function registerFrontend(app: FastifyInstance, devUrl?: string) {
  // eslint-disable-next-line unicorn/prefer-ternary
  if (devUrl !== undefined) {
    await app.register(httpProxy, {
      upstream: devUrl,
      websocket: true,
      disableRequestLogging: true,
    });
  } else {
    await app.register(staticPlugin, { root: getFrontendDistributionPath() });
  }
}
