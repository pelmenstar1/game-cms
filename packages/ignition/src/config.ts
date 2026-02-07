import { basePlugin } from '@game-cms/base-plugin';
import type { ResolvedCmsConfig, UnresolvedCmsConfig } from '@game-cms/core';
import { type MaybePromise, resolveMaybeFactory } from '@game-cms/shared';
import { createEnvAccessor, type EnvAccessor } from '@game-cms/shared/node/io';
import { createJiti } from 'jiti';

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);
type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;

async function importConfig(filePath: string) {
  const jiti = createJiti(import.meta.url);

  return jiti.import<ConfigInit>(filePath, { default: true });
}

export async function resolveConfig(
  compiledFilePath: (value: string) => string
): Promise<ResolvedCmsConfig> {
  const configPath = compiledFilePath('cms.config.ts');
  const configInit = await importConfig(configPath);

  const instance = await resolveMaybeFactory(configInit, createEnvAccessor());

  return {
    ...instance,
    plugins: [basePlugin, ...(instance.plugins ?? [])],
  };
}
