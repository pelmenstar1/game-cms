import {
  type BaseCmsEnvironment,
  type CmsEnvironment,
  initializeEnv,
} from '@game-cms/global';
import { loadEnvFileIfExists } from '@game-cms/shared';
import { mergeObjects, resolveObject } from '@game-cms/shared/object';
import type {
  EnvResolver,
  ResolvedCmsConfig,
  ValueSourceContext,
} from '@game-cms/types';

import { compiledFilePath } from '../../utils/localPath.js';
import { getAllServices, getApiConfig } from './api.js';
import { getAllComponents } from './components.js';
import { resolveConfig } from './config.js';
import { getSharedAssetsConfig } from './sharedAssets.js';

type BaseEnvResolvers = EnvResolver<Omit<BaseCmsEnvironment, 'config'>>;

const baseEnvResolvers: BaseEnvResolvers = {
  api: getApiConfig,
  components: getAllComponents,
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

  initializeEnv(mergeObjects([{ config }, ...items]) as CmsEnvironment);
}
