import path from 'node:path';

import { setupApi } from '@game-cms/api';
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
  const apiBuildPath = getPackageBuildDirectory('@game-cms/api');

  const [routes, services] = await Promise.all([
    scanApiRoutes(directoryPaths(apiBuildPath, 'routes')),
    scanServices(directoryPaths(apiBuildPath, 'services')),
  ]);

  await setupApi(app, { routes, services });
}
