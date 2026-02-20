import { StorageItemType } from '@game-cms/base-core';
import { ApiError } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { temporalDirectory } from '@game-cms/shared/node/io';
import { fastify, type RouteOptions } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { describe, expect, test } from 'vitest';

import { localStorageProvider } from './index.js';

const GET_ROUTE = '/storage/file/get';

function createAppWithRoutes(storagePath: string) {
  const provider = localStorageProvider({ storagePath });
  const app = fastify({ logger: false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  for (const route of provider.routes ?? []) {
    app.route(route as unknown as RouteOptions);
  }

  return { app, provider };
}

describe('getFileRoute', () => {
  test('should return file content with correct content-type', async () => {
    await using dir = await temporalDirectory();
    const { app, provider } = createAppWithRoutes(dir.path);

    const content = Buffer.from('hello world');

    const name = 'test.txt';
    const mime = 'text/plain';

    const { extra } = await provider.protocol.upload({
      name,
      mime,
      content,
    });

    await cms().service('base::storage').collection().insertOne({
      type: StorageItemType.FILE,
      size: content.length,
      addons: {},
      name,
      mime,
      extra,
    });

    const res = await app.inject({
      method: 'GET',
      url: `${GET_ROUTE}/${extra.fileName}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('text/plain');
    expect(res.body).toBe('hello world');
  });

  test('should return 404 when file record is not in database', async () => {
    await using dir = await temporalDirectory();
    const { app } = createAppWithRoutes(dir.path);

    let caughtError: unknown;

    app.setErrorHandler(async (error, _req, reply) => {
      caughtError = error;

      await reply.status(404).send({ error: 'not found' });
    });

    const res = await app.inject({
      method: 'GET',
      url: `${GET_ROUTE}/non-existent-file.txt`,
    });

    expect(res.statusCode).toBe(404);
    expect(caughtError).toBeInstanceOf(ApiError);
    expect((caughtError as ApiError).code).toBe('base::entity/notFound');
  });

  test('should return 404 when file exists in database but not on disk', async () => {
    await using dir = await temporalDirectory();
    const { app } = createAppWithRoutes(dir.path);

    const name = 'ghost.txt';

    await cms()
      .service('base::storage')
      .collection()
      .insertOne({
        type: StorageItemType.FILE,
        name,
        mime: 'text/plain',
        size: 5,
        extra: { fileName: name },
        addons: {},
      });

    let caughtError: unknown;

    app.setErrorHandler(async (error, _req, reply) => {
      caughtError = error;
      await reply.status(404).send({ error: 'not found' });
    });

    const res = await app.inject({
      method: 'GET',
      url: `${GET_ROUTE}/${name}`,
    });

    expect(res.statusCode).toBe(404);
    expect(caughtError).toBeInstanceOf(ApiError);
    expect((caughtError as ApiError).code).toBe('base::entity/notFound');
  });
});
