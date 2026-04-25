import path from 'node:path';

import { PluginValueSourceContext } from '@game-cms/core';
import { CmsFastifyInstance } from '@game-cms/core/api';
import { scanDirectorySource } from '@game-cms/core/node';
import { env } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { jsDefaultModuleImporter } from '@game-cms/shared/node';
import fastify, { RouteOptions } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { apiConfig } from '../../index.js';

export async function serverBootstrap() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const routesSource = scanDirectorySource<RouteOptions>(
    path.join(import.meta.dirname, '../../../dist/routes'),
    jsDefaultModuleImporter
  );

  const { config } = env();

  const pluginContext = {
    config,
  } as PluginValueSourceContext;

  const routes = await resolveAsyncMaybeFactory(routesSource, pluginContext);

  await apiConfig.fastify?.setup?.(
    app as unknown as CmsFastifyInstance,
    pluginContext.config
  );

  for (const route of routes) {
    app.route({ ...route, url: `/api${route.url}` });
  }

  const url = await app.listen({ port: 0 });

  return { url, close: () => app.close() };
}
