import type { Plugin, PluginApiFastifyConfig } from '@game-cms/core';
import type { CmsFastifyInstance } from '@game-cms/core/api';
import { env } from '@game-cms/global';

async function initPluginFastify(
  config: PluginApiFastifyConfig,
  app: CmsFastifyInstance
) {
  const { plugins } = config;

  await config.setup?.(app);

  if (plugins) {
    for (const plugin of plugins) {
      await app.register(plugin);
    }
  }
}

async function initPlugin(plugin: Plugin, app: CmsFastifyInstance) {
  const { config } = env();

  await plugin.setup?.(config);

  const fastifyConfig = plugin.api?.fastify;
  if (fastifyConfig !== undefined) {
    await initPluginFastify(fastifyConfig, app);
  }
}

export async function initPlugins(app: CmsFastifyInstance) {
  const { plugins } = env().config;

  await Promise.all(plugins.map((plugin) => initPlugin(plugin, app)));
}
