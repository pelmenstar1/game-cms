import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type { ComponentId, ComponentRendererVariant } from '@game-cms/core';
import { getComponentIdFromClientFile } from '@game-cms/core/node';
import { filterOutNullable } from '@game-cms/shared/collections';
import { glob } from 'glob';

import { getRendererVariantFromFilePath } from './internal/gather.js';

export type ComponentClientChunkEntry = {
  paths: {
    renderers: Record<ComponentRendererVariant, string>;
    client: string;
  };
};

export type ComponentClientChunkMap = Record<
  ComponentId,
  ComponentClientChunkEntry
>;

async function gatherRenderers(dirPath: string) {
  const otherRendererFiles = await glob('renderer.*.js', {
    cwd: dirPath,
    absolute: true,
    nodir: true,
  });

  const defaultRenderer = path.join(dirPath, 'renderer.js');
  if (!fs.existsSync(defaultRenderer)) {
    return;
  }

  const result: Record<ComponentRendererVariant, string> = {
    default: defaultRenderer,
  };

  for (const filePath of otherRendererFiles) {
    const variant = getRendererVariantFromFilePath(filePath);

    if (variant) {
      result[variant] = filePath;
    }
  }

  return result;
}

async function gatherComponentClientChunk(dirPath: string) {
  const client = path.join(dirPath, 'client.js');

  const [renderers, componentId] = await Promise.all([
    gatherRenderers(dirPath),
    getComponentIdFromClientFile(client),
  ]);

  if (componentId !== null && renderers) {
    const entry: ComponentClientChunkEntry = {
      paths: { renderers, client },
    };

    return [componentId, entry] as const;
  }
}

async function gatherComponentsForDistribution(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        gatherComponentClientChunk(path.join(distPath, entry.name))
      )
  );

  return filterOutNullable(result);
}

export async function gatherComponents(env: {
  components: {
    distributions: {
      directoryPath: string;
    }[];
  };
}): Promise<ComponentClientChunkMap> {
  const result = await Promise.all(
    env.components.distributions.map(({ directoryPath }) =>
      gatherComponentsForDistribution(directoryPath)
    )
  );

  return Object.fromEntries(result.flat());
}
