import path from 'node:path';

import type { CmsEnvironment } from '@game-cms/env';

import type { ConfigInit } from '../../types/config.js';
import { createEnvAccessor, type EnvAccessor } from '../../utils/env.js';
import { compiledDirectoryPath } from '../../utils/localPath.js';

type ConfigMap = CmsEnvironment['config'];
type ConfigKey = keyof ConfigMap;
type ConfigInitMap = {
  [K in ConfigKey]: ConfigInit<ConfigMap[K]>;
};

const configNames: ConfigKey[] = ['storage', 'database', 'server'];

async function getConfigMap(): Promise<ConfigInitMap> {
  const basePath = path.join(process.cwd(), compiledDirectoryPath('config'));

  const entries = await Promise.all(
    configNames.map(async (name) => {
      const module = (await import(`file://${basePath}/${name}.js`)) as {
        config: unknown;
      };

      return [name, module.config];
    })
  );

  return Object.fromEntries(entries) as ConfigInitMap;
}

async function resolveConfigInit<T extends object>(
  env: EnvAccessor,
  init: ConfigInit<T>
): Promise<T> {
  if (typeof init === 'function') {
    return await init(env);
  }

  return init;
}

export async function resolveConfigInitMap(): Promise<ConfigMap> {
  const map = await getConfigMap();

  const env = createEnvAccessor();
  const entries = await Promise.all(
    Object.entries(map).map(async ([key, init]) => [
      key,
      await resolveConfigInit(env, init),
    ])
  );

  return Object.fromEntries(entries) as ConfigMap;
}
