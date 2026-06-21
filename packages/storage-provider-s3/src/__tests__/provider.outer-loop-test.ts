import { randomUUID } from 'node:crypto';

import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ApiError } from '@game-cms/core/api';
import { setupStorageProviderTests } from '@game-cms/testing-lib';
import { fastify, RouteOptions } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { describe, expect, test } from 'vitest';

import { GET_ROUTE } from '../internal/constants.js';
import { s3StorageProvider } from '../provider.js';
import { S3StorageProviderConfig } from '../types.js';
import { getTestConfig, loadTestEnv } from './internal/utils.js';

await loadTestEnv();

function createAppWithRoutes(config: S3StorageProviderConfig) {
  const provider = s3StorageProvider(config);
  const app = fastify({ logger: false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const routes = provider.routes ?? [];
  for (const route of routes) {
    app.route(route as unknown as RouteOptions);
  }

  return { app, provider };
}

describe.runIf('TEST_S3_API_URL' in process.env)('getFileRoute', () => {
  test('should return file content with correct headers', async () => {
    const config = getTestConfig();
    const { app, provider } = createAppWithRoutes(config);

    const content = Buffer.from('hello world');

    const { extra } = await provider.protocol.upload({
      name: 'test.txt',
      mime: 'text/plain',
      content,
    });

    const res = await app.inject({
      method: 'GET',
      url: `${GET_ROUTE}/${extra.key}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('text/plain');
    expect(res.body).toBe('hello world');
  });

  test('should return 404 for non-existent file', async () => {
    const config = getTestConfig();
    const { app } = createAppWithRoutes(config);

    let caughtError: unknown;

    app.setErrorHandler(async (error, _req, reply) => {
      caughtError = error;
      await reply.status(404).send({ error: 'not found' });
    });

    const res = await app.inject({
      method: 'GET',
      url: `${GET_ROUTE}/non-existent-key.txt`,
    });

    expect(res.statusCode).toBe(404);
    expect(caughtError).toBeInstanceOf(ApiError);
    expect((caughtError as ApiError).code).toBe('base::entity/notFound');
  });
});

describe.runIf('TEST_S3_API_URL' in process.env)('s3StorageProvider', () => {
  setupStorageProviderTests({
    createProvider: () => {
      const config = getTestConfig();
      const s3Client = new S3Client(config.client);

      return {
        value: s3StorageProvider({ ...config, publicUrl: 'http://localhost' }),
        bucket: config.bucket,
        s3Client,
        [Symbol.asyncDispose]: async () => {},
      };
    },
    exists: async (provider, extra) => {
      try {
        await provider.s3Client.send(
          new HeadObjectCommand({
            Bucket: provider.bucket,
            Key: extra.key,
          })
        );

        return true;
      } catch {
        return false;
      }
    },
    nonExistingExtra: () => ({ key: randomUUID() }),
  });
});
