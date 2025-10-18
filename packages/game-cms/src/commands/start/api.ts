import { setupApi } from '@game-cms/api';
import type { Application } from 'express';
import { scanApiRoutes, scanServices } from './scan.js';
import path from 'node:path';
import { getPackageBuildDirectory } from './utils.js';
import {
  type CompiledFolderName,
  compiledDirectoryPath,
} from '../../utils/localPath.js';

function directoryPaths(apiBuildPath: string, name: CompiledFolderName) {
  return [path.join(apiBuildPath, name), compiledDirectoryPath(name)];
}

export async function setupApiFromConfig(app: Application) {
  const apiBuildPath = getPackageBuildDirectory('@game-cms/api');

  const [routes, services] = await Promise.all([
    scanApiRoutes(directoryPaths(apiBuildPath, 'routes')),
    scanServices(directoryPaths(apiBuildPath, 'services')),
  ]);

  setupApi(app, { routes, services });
}
