import fs from 'node:fs';
import path from 'node:path';

import { mergeObjects } from '@game-cms/shared/object';
import type {
  ComponentController,
  ComponentStaticConfig,
  ComponentStaticConfigMap,
} from '@game-cms/types';

import { compiledDirectoryPath } from '../../utils/localPath.js';
import { componentSchema } from '../../utils/schema.js';
import {
  getViteManifest,
  traceEntryPointJsDependencies,
  traceEntryPointStyles,
  type ViteManifest,
  type ViteManifestEntry,
} from '../../utils/viteManifest.js';
import { getPackageBuildDirectory } from './utils.js';

const RENDERER_SUFFIX = '-renderer';

async function importController(
  filePath: string
): Promise<ComponentController> {
  const module: unknown = await import(`file://${filePath}`);
  if (!(typeof module === 'object' && module !== null && 'default' in module)) {
    throw new Error(`Expected default export in ${filePath}`);
  }

  const result = componentSchema.safeParse(module.default);
  if (result.success) {
    return module.default as ComponentController;
  }

  throw result.error;
}

async function createComponentStaticConfigEntry(
  manifest: ViteManifest,
  rendererEntry: ViteManifestEntry,
  directoryPath: string
): Promise<[string, ComponentStaticConfig]> {
  const manifestEntries = Object.values(manifest);
  const controllerName = rendererEntry.name?.slice(0, -RENDERER_SUFFIX.length);
  if (controllerName === undefined) {
    throw new Error(`No renderer entry name`);
  }

  const controllerEntry = manifestEntries.find(
    (controllerEntry) => controllerEntry.name === controllerName
  );

  if (controllerEntry === undefined) {
    throw new Error(`No controller for ${controllerName} component`);
  }

  const controllerFilePath = path.join(directoryPath, controllerEntry.file);
  const controller = await importController(controllerFilePath);

  return [
    controller.id,
    {
      baseDirectory: directoryPath,
      controller,
      renderManifest: {
        jsBundle: rendererEntry.file,
        jsDependencies: traceEntryPointJsDependencies(manifest, rendererEntry),
        cssBundles: traceEntryPointStyles(manifest, rendererEntry),
      },
    },
  ];
}

async function scanDirectoryForComponents(
  directoryPath: string
): Promise<ComponentStaticConfigMap> {
  if (!fs.existsSync(directoryPath)) {
    return {};
  }

  const manifest = await getViteManifest(directoryPath);
  const manifestEntries = Object.values(manifest);

  const result = await Promise.all(
    manifestEntries.map(async (entry) => {
      if (entry.name?.endsWith(RENDERER_SUFFIX)) {
        return createComponentStaticConfigEntry(manifest, entry, directoryPath);
      }
    })
  );

  return Object.fromEntries(
    result.filter((value) => value !== undefined)
  ) as ComponentStaticConfigMap;
}

export async function scanAllComponents(): Promise<ComponentStaticConfigMap> {
  const directoryPaths = [
    getPackageBuildDirectory('@game-cms/components'),
    compiledDirectoryPath('components'),
  ];

  const result = await Promise.all(
    directoryPaths.map((dirPath) => scanDirectoryForComponents(dirPath))
  );

  return mergeObjects(result);
}
