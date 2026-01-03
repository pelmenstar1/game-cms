import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { env } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';
import type { ComponentId } from '@game-cms/types';

import { getComponentIdFromMetaFile } from './analysis.js';

export type ComponentClientChunkEntry = {
  paths: {
    main: string;
    meta: string;
    validator: string;
    clientResolver?: string;
  };
};

export type ComponentClientChunkMap = Record<
  ComponentId,
  ComponentClientChunkEntry
>;

async function gatherComponentClientChunk(dirPath: string) {
  const main = path.join(dirPath, 'client.js');
  const meta = path.join(dirPath, 'meta.js');
  const validator = path.join(dirPath, 'validator.js');
  const clientResolver = path.join(dirPath, 'clientResolver.js');

  if (fs.existsSync(main) && fs.existsSync(meta) && fs.existsSync(validator)) {
    const componentId = await getComponentIdFromMetaFile(meta);

    const entry: ComponentClientChunkEntry = {
      paths: {
        main,
        meta,
        validator,
        clientResolver: fs.existsSync(clientResolver)
          ? clientResolver
          : undefined,
      },
    };

    return [componentId, entry] as const;
  }
}

async function gatherComponentsForDistribution(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        return gatherComponentClientChunk(path.join(distPath, entry.name));
      }
    })
  );

  return filterOutNullable(result);
}

export async function gatherComponents(): Promise<ComponentClientChunkMap> {
  const { components } = env();

  const result = await Promise.all(
    components.distributions.map((distPath) =>
      gatherComponentsForDistribution(distPath)
    )
  );

  return Object.fromEntries(result.flat());
}
