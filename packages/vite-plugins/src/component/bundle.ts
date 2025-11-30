import { COMPONENT_RENDERER_SUFFIX } from '@game-cms/build';
import type { Replace } from '@game-cms/shared';
import type { ComponentId, ComponentStaticConfig } from '@game-cms/types';
import type { OutputBundle, OutputChunk } from 'rollup';

import {
  getComponentIdFromMetaChunk,
  trackRendererDependencies,
} from './analysis.js';
import { findChunkWithName, minifyCode } from './utils.js';

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

function getBundleRenderers(bundle: OutputBundle) {
  return Object.values(bundle).filter(
    (value): value is OutputChunk =>
      value.type === 'chunk' && value.name.endsWith(COMPONENT_RENDERER_SUFFIX)
  );
}

function findControllerForRenderer(bundle: OutputBundle, name: string) {
  const controllerChunkName = name.slice(0, -COMPONENT_RENDERER_SUFFIX.length);

  return findChunkWithName(bundle, controllerChunkName);
}

function findMetaFileChunk(bundle: OutputBundle, rendererName: string) {
  const chuckName = `${rendererName.slice(0, -COMPONENT_RENDERER_SUFFIX.length)}-meta`;

  return findChunkWithName(bundle, chuckName);
}

async function getRenderManifest(
  bundle: OutputBundle,
  rendererChuck: OutputChunk
) {
  return {
    main: await minifyCode(rendererChuck.code),
    dependencies: await trackRendererDependencies(bundle, rendererChuck),
  };
}

async function getComponentStaticConfig(
  bundle: OutputBundle,
  rendererChuck: OutputChunk
) {
  const controllerChunk = findControllerForRenderer(bundle, rendererChuck.name);
  const metaChunk = findMetaFileChunk(bundle, rendererChuck.name);

  if (!controllerChunk) {
    throw new Error(
      `Cannot find a controller for renderer: ${rendererChuck.name}`
    );
  }

  if (!metaChunk) {
    throw new Error(
      `Cannot find a meta file for renderer: ${rendererChuck.name}`
    );
  }

  const id = getComponentIdFromMetaChunk(metaChunk);

  const config: ComponentBuildStaticConfig = {
    controller: { filePath: controllerChunk.fileName },
    renderManifest: await getRenderManifest(bundle, rendererChuck),
  };

  return { id, config };
}

export async function getComponentStaticConfigMap(bundle: OutputBundle) {
  const renderers = getBundleRenderers(bundle);

  const entries = await Promise.all(
    renderers.map(async (chunk) => {
      const { id, config } = await getComponentStaticConfig(bundle, chunk);

      return [id, config] as const;
    })
  );

  return Object.fromEntries(entries) as ComponentBuildStaticConfigMap;
}
