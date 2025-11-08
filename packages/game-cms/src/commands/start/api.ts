import path from 'node:path';

import { type CmsEnvironment } from '@game-cms/env';

import {
  type CompiledFileName,
  compiledFilePath,
} from '../../utils/localPath.js';
import { scanApiRoutes, scanServices } from './scan.js';
import { getPackageBuildDirectory } from './utils.js';

function directoryPaths(apiBuildPath: string, name: CompiledFileName) {
  return [path.join(apiBuildPath, name), compiledFilePath(name)];
}

export async function getApiRoutes(config: CmsEnvironment['config']) {
  const storageProvider = config.storage.provider;
  const apiBuildPath = getPackageBuildDirectory('@game-cms/api');

  const result = await scanApiRoutes(directoryPaths(apiBuildPath, 'routes'));

  return [...result, ...(storageProvider.routes ?? [])];
}

export async function getAllServices() {
  const apiBuildPath = getPackageBuildDirectory('@game-cms/api');

  return scanServices(directoryPaths(apiBuildPath, 'services'));
}
