import type {
  AnyPlugin,
  PluginApiFastifyConfig,
  ResolvedCmsConfig,
} from '@game-cms/core';
import type { CmsFastifyInstance } from '@game-cms/core/api';
import { env } from '@game-cms/global';

async function initPluginFastify(
  config: ResolvedCmsConfig,
  apiConfig: PluginApiFastifyConfig,
  app: CmsFastifyInstance
) {
  const { plugins } = apiConfig;

  await apiConfig.setup?.(app, config);

  if (plugins) {
    for (const plugin of plugins) {
      await app.register(plugin);
    }
  }
}

async function initPlugin(
  config: ResolvedCmsConfig,
  app: CmsFastifyInstance,
  plugin: AnyPlugin
) {
  await plugin.setup?.(config);

  const fastifyConfig = plugin.config?.api?.fastify;
  if (fastifyConfig !== undefined) {
    await initPluginFastify(config, fastifyConfig, app);
  }
}

export async function initPlugins(app: CmsFastifyInstance) {
  const { config } = env();
  const { plugins } = config;

  await Promise.all(plugins.map((plugin) => initPlugin(config, app, plugin)));
}
