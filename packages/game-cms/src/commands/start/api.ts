import path from 'node:path';

import { setupApi } from '@game-cms/api';
import { env } from '@game-cms/env';
import type { FastifyInstance } from 'fastify';

import {
  compiledDirectoryPath,
  type CompiledFolderName,
} from '../../utils/localPath.js';
import { scanApiRoutes, scanServices } from './scan.js';
import { getPackageBuildDirectory } from './utils.js';

function directoryPaths(apiBuildPath: string, name: CompiledFolderName) {
  return [path.join(apiBuildPath, name), compiledDirectoryPath(name)];
}

export async function setupApiFromConfig(app: FastifyInstance) {
  const storageProvider = env().config.storage.provider;
  const apiBuildPath = getPackageBuildDirectory('@game-cms/api');

  const [routes, services] = await Promise.all([
    scanApiRoutes(directoryPaths(apiBuildPath, 'routes')),
    scanServices(directoryPaths(apiBuildPath, 'services')),
  ]);

  routes.push(...(storageProvider.routes ?? []));

  await setupApi(app, { routes, services });
}
