import { basePlugin } from '@game-cms/base-plugin';
import { type MaybePromise, resolveMaybeFactory } from '@game-cms/shared';
import {
  createEnvAccessor,
  type EnvAccessor,
  importFile,
} from '@game-cms/shared/io';
import type { ResolvedCmsConfig, UnresolvedCmsConfig } from '@game-cms/types';

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

export type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;

async function importConfig(filePath: string) {
  const { default: result } = await importFile<{ default: ConfigInit }>(
    filePath
  );

  return result;
}

export async function resolveConfig(
  compiledFilePath: (value: string) => string
): Promise<ResolvedCmsConfig> {
  const configPath = compiledFilePath('cms.config.js');
  const configInit = await importConfig(configPath);

  const instance = await resolveMaybeFactory(configInit, createEnvAccessor());

  return {
    ...instance,
    plugins: [basePlugin, ...(instance.plugins ?? [])],
  };
}
