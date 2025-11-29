import { env } from '@game-cms/env';
import type { Plugin, PluginApiFastifyConfig } from '@game-cms/types';
import type { FastifyInstance } from 'fastify';

async function initPluginFastify(
  config: PluginApiFastifyConfig,
  app: FastifyInstance
) {
  const { plugins } = config;

  await config.setup?.(app);

  if (plugins) {
    for (const plugin of plugins) {
      await app.register(plugin);
    }
  }
}

async function initPlugin(plugin: Plugin, app: FastifyInstance) {
  const { config } = env();

  await plugin.setup?.(config);

  const fastifyConfig = plugin.api?.fastify;
  if (fastifyConfig !== undefined) {
    await initPluginFastify(fastifyConfig, app);
  }
}

export async function initPlugins(app: FastifyInstance) {
  const { plugins } = env().config;

  await Promise.all(plugins.map((plugin) => initPlugin(plugin, app)));
}
