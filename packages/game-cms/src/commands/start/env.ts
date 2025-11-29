import {
  type BaseCmsEnvironment,
  type CmsEnvironment,
  initializeEnv,
} from '@game-cms/env';
import { loadEnvFileIfExists } from '@game-cms/shared';
import { mergeObjects, resolveObject } from '@game-cms/shared/object';
import type {
  EnvResolver,
  ResolvedCmsConfig,
  ValueSourceContext,
} from '@game-cms/types';

import { compiledFilePath } from '../../utils/localPath.js';
import { getAllServices, getApiRoutes } from './api.js';
import { scanAllComponents } from './components.js';
import { resolveConfig } from './config.js';
import { getSharedAssetsConfig } from './sharedAssets.js';

type BaseEnvResolvers = EnvResolver<Omit<BaseCmsEnvironment, 'config'>>;

const baseEnvResolvers: BaseEnvResolvers = {
  apiRoutes: getApiRoutes,
  components: scanAllComponents,
  services: getAllServices,
  sharedAssets: getSharedAssetsConfig,
};

function getPluginEnvResolvers(config: ResolvedCmsConfig) {
  const { plugins } = config;

  return plugins
    .map((plugin) => ('env' in plugin ? plugin.env : undefined))
    .filter((value) => value !== undefined);
}

export async function initEnvFromConfigs() {
  await loadEnvFileIfExists();

  const config = await resolveConfig();

  const resolvers: EnvResolver<object>[] = [
    ...getPluginEnvResolvers(config),
    baseEnvResolvers,
  ];

  const context: ValueSourceContext = {
    config,
    compiledFilePath,
  };

  const items = await Promise.all(
    resolvers.map((resolver) => resolveObject(resolver, context))
  );

  initializeEnv(mergeObjects(items) as CmsEnvironment);
}
