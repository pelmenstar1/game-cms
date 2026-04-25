import { delay } from '@game-cms/shared';
import { fastify } from 'fastify';
import { describe, expect, it } from 'vitest';

import { abortablePlugin } from './abortable.js';

describe('abortablePlugin', () => {
  it('sets abortSignal on request', async () => {
    const app = fastify({ logger: false });
    abortablePlugin(app, {}, () => {});

    let capturedSignal: AbortSignal | undefined;

    app.get('/', (req) => {
      capturedSignal = req.abortSignal;
      return {};
    });

    await app.inject({ path: '/' });

    expect(capturedSignal).toBeDefined();
    expect(capturedSignal?.aborted).toBe(false);
  });

  it('aborts signal when request is aborted', async () => {
    const app = fastify({ logger: false });
    abortablePlugin(app, {}, () => {});

    let capturedSignal: AbortSignal | undefined;

    const handlerStarted = new Promise<void>((resolve) => {
      app.get('/', async (req) => {
        capturedSignal = req.abortSignal;
        resolve();
        await new Promise<void>((_, reject) => {
          capturedSignal?.addEventListener('abort', () => {
            reject(new Error('aborted'));
          });
        });
      });
    });

    const serverUrl = await app.listen({ port: 0 });

    try {
      const controller = new AbortController();

      fetch(serverUrl, { signal: controller.signal }).catch(() => {});

      await handlerStarted;
      controller.abort();

      await delay(100);

      expect(capturedSignal?.aborted).toBe(true);
    } finally {
      await app.close();
    }
  });
});
