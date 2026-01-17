/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { errorHandler } from './errorHandler.js';

describe('errorHandler', () => {
  it('should handle Fastify validation error', async () => {
    const app = fastify({ logger: false });
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler());

    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    app.post('/', {
      schema: {
        body: schema,
      },
      handler: () => ({ success: true }),
    });

    const res = await app.inject({
      method: 'POST',
      path: '/',
      payload: { name: 'John', age: 'invalid' },
    });

    expect(res.statusCode).toBe(400);
    const body = res.json<unknown>();

    expect(body).toMatchObject({
      error: {
        message: expect.any(String),
        code: 'base::schema/validation',
      },
    });
  });
});
