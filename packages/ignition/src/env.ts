import path from 'node:path';

import type {
  EnvResolver,
  ResolvedCmsConfig,
  ValueSourceContext,
} from '@game-cms/core';
import {
  type BaseCmsEnvironment,
  type CmsEnvironment,
  setEnvironment,
} from '@game-cms/global';
import { loadEnvFileIfExists } from '@game-cms/shared/io';
import { mergeObjects, resolveObject } from '@game-cms/shared/object';

import { getAllServices, getApiConfig } from './api.js';
import { getComponentEnv } from './components.js';
import { resolveConfig } from './config.js';

type BaseEnvResolvers = EnvResolver<
  Omit<BaseCmsEnvironment, 'config' | 'compiledFilePath'>
>;

const baseEnvResolvers: BaseEnvResolvers = {
  api: getApiConfig,
  components: getComponentEnv,
  services: getAllServices,
};

function getPluginEnvResolvers(config: ResolvedCmsConfig) {
  const { plugins } = config;

  return plugins
    .map((plugin) => ('env' in plugin ? plugin.env : undefined))
    .filter((value) => value !== undefined);
}

export async function initEnvFromConfigs(baseDir: string = './') {
  const compiledFilePath = (value: string) => path.join(baseDir, 'src', value);

  await loadEnvFileIfExists(baseDir);

  const config = await resolveConfig(compiledFilePath);

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

  setEnvironment(mergeObjects([{ config }, ...items]) as CmsEnvironment);
}
