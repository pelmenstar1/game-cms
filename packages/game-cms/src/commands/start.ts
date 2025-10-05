import { env, initializeEnv, type CmsEnvironment } from '@game-cms/env';
import process from 'node:process';
import path from 'node:path';
import express from 'express';
import type { ConfigInit } from '../types/config.js';
import { createEnvAccessor, type EnvAccessor } from '../utils/env.js';
import { loadEnvIfExists } from '@game-cms/shared';
import { createRequestHandler } from '@react-router/express';
import { fileURLToPath } from 'node:url';
import type { ServerBuild } from 'react-router';
import { statusInline } from '../utils/log.js';
import chalk from 'chalk';

const COMPILED_CONFIG_PATH = './dist';

type ConfigMap = CmsEnvironment['config'];
type ConfigKey = keyof ConfigMap;
type ConfigInitMap = {
  [K in ConfigKey]: ConfigInit<ConfigMap[K]>;
};

const configNames: ConfigKey[] = ['storage', 'database', 'server'];

async function getConfigMap(): Promise<ConfigInitMap> {
  const basePath = path.join(process.cwd(), COMPILED_CONFIG_PATH);

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

async function resolveConfigInitMap(map: ConfigInitMap): Promise<ConfigMap> {
  const env = createEnvAccessor();
  const entries = await Promise.all(
    Object.entries(map).map(async ([key, init]) => [
      key,
      await resolveConfigInit(env, init),
    ])
  );

  return Object.fromEntries(entries) as ConfigMap;
}

async function initEnvFromConfigs() {
  await loadEnvIfExists();

  const configInitMap = await getConfigMap();
  const configMap = await resolveConfigInitMap(configInitMap);

  initializeEnv({ config: configMap });
}

async function startServer() {
  const dashboardImportUrl = import.meta.resolve('@game-cms/dashboard');
  const dashboardPath = path.join(
    path.dirname(fileURLToPath(dashboardImportUrl)),
    '../../'
  );
  const dashboardBuild = (await import(dashboardImportUrl)) as ServerBuild;

  const app = express();
  app.disable('x-powered-by');
  app.use(
    dashboardBuild.publicPath,
    express.static(
      path.join(dashboardPath, dashboardBuild.assetsBuildDirectory)
    )
  );
  app.use(
    '/{*splat}',
    createRequestHandler({
      build: dashboardBuild,
      mode: 'production',
    })
  );

  const { port } = env().config.server;

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    statusInline(
      `Server started at ${chalk.magentaBright(`http://localhost:${port}`)}`
    );
  });
}

export default async function start() {
  statusInline('Loading configs');
  await initEnvFromConfigs();

  statusInline('Server starting...');
  await startServer();
}
