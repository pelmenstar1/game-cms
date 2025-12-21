import fsp from 'node:fs/promises';
import path from 'node:path';

import { COMPONENT_CLIENT_SUFFIX } from '@game-cms/build';
import type { Replace } from '@game-cms/shared';
import {
  getViteManifest,
  traceEntryPointJsDependencies,
  traceEntryPointStyles,
  type ViteManifest,
  type ViteManifestEntry,
} from '@game-cms/shared/vite';
import type {
  ComponentId,
  ComponentRendererDependencies,
  ComponentStaticConfig,
} from '@game-cms/types';
import type { OutputBundle } from 'rollup';

import { getComponentIdFromMetaChunk } from './analysis.js';
import { findChunkWithName, minifyCode } from './utils.js';

type ViteManifestEntryWithName = Replace<ViteManifestEntry, { name: string }>;

const CLIENT_DIR = './dist/client';

export type ComponentBuildStaticConfig = Replace<
  ComponentStaticConfig,
  {
    controller: { filePath: string };
  }
>;

export type ComponentBuildStaticConfigMap = Record<
  ComponentId,
  ComponentBuildStaticConfig
>;

function getClientBundles(manifest: ViteManifest) {
  return Object.values(manifest).filter(
    (value): value is ViteManifestEntryWithName =>
      value.name?.endsWith(COMPONENT_CLIENT_SUFFIX) ?? false
  );
}

function findControllerByClientBundle(
  bundle: OutputBundle,
  componentName: string
) {
  return findChunkWithName(bundle, componentName);
}

function findMetaFileChunk(bundle: OutputBundle, componentName: string) {
  const chunkName = `${componentName}-meta`;

  return findChunkWithName(bundle, chunkName);
}

async function readClientBundleFile(fileName: string) {
  return fsp.readFile(path.join(CLIENT_DIR, fileName), 'utf8');
}

async function traceClientBundleDependencies(
  manifest: ViteManifest,
  clientEntry: ViteManifestEntry
): Promise<ComponentRendererDependencies> {
  const jsEntries = traceEntryPointJsDependencies(manifest, clientEntry);
  const cssEntries = traceEntryPointStyles(manifest, clientEntry);

  const jsObjectEntries = await Promise.all(
    jsEntries.map(async (entry) => {
      let code = await readClientBundleFile(entry);
      code = await minifyCode(code);

      return [entry, code] as const;
    })
  );

  const cssObjectEntries = await Promise.all(
    cssEntries.map(async (entry) => {
      const code = await readClientBundleFile(entry);

      return [entry, code] as const;
    })
  );

  return {
    js: Object.fromEntries(jsObjectEntries),
    css: Object.fromEntries(cssObjectEntries),
  };
}

async function getRenderManifest(
  manifest: ViteManifest,
  clientEntry: ViteManifestEntryWithName
) {
  const clientCode = await readClientBundleFile(clientEntry.file);

  return {
    main: await minifyCode(clientCode),
    dependencies: await traceClientBundleDependencies(manifest, clientEntry),
  };
}

async function getComponentStaticConfig(
  manifest: ViteManifest,
  serverBundle: OutputBundle,
  clientEntry: ViteManifestEntryWithName
) {
  const componentName = clientEntry.name.slice(
    0,
    -COMPONENT_CLIENT_SUFFIX.length
  );
  const controllerChunk = findControllerByClientBundle(
    serverBundle,
    componentName
  );
  const metaChunk = findMetaFileChunk(serverBundle, componentName);

  if (!controllerChunk) {
    throw new Error(
      `Cannot find a controller for renderer: ${clientEntry.name}`
    );
  }

  if (!metaChunk) {
    throw new Error(
      `Cannot find a meta file for renderer: ${clientEntry.name}`
    );
  }

  const id = getComponentIdFromMetaChunk(metaChunk);

  const config: ComponentBuildStaticConfig = {
    controller: { filePath: controllerChunk.fileName },
    renderManifest: await getRenderManifest(manifest, clientEntry),
  };

  return { id, config };
}

export async function getComponentStaticConfigMap(serverBundle: OutputBundle) {
  const viteManifest = await getViteManifest('./dist/client');
  const clientBundles = getClientBundles(viteManifest);

  const entries = await Promise.all(
    clientBundles.map(async (chunk) => {
      const { id, config } = await getComponentStaticConfig(
        viteManifest,
        serverBundle,
        chunk
      );

      return [id, config] as const;
    })
  );

  return Object.fromEntries(entries) as ComponentBuildStaticConfigMap;
}
