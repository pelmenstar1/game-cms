import { defineComponentController } from '@game-cms/core';
import { ObjectId } from 'mongodb';

import { createShadowFileOrchestration } from '../../utils/shadowFile.js';
import core from './core.js';
import {
  ATLAS_OPTIONS,
  type ComposeArgs,
  type ComposeId,
  composeOptions,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './internal/constants.js';
import { createShadowAtlasContent } from './internal/shadowAtlas.js';

const shadowAtlasOrchestration = createShadowFileOrchestration({
  shadowName: 'shadow-atlas.atlas',
  mime: 'application/octet-stream',
  getContent: async (
    atlasContent,
    args: { textureIds: ObjectId[] },
    context
  ) => {
    const textureUrls = await Promise.all(
      args.textureIds.map((id) => context.getUrl(id))
    );

    return createShadowAtlasContent(atlasContent, textureUrls);
  },
});

export default defineComponentController({
  core,
  structure: (_, context) =>
    context.getStructure<ComposeId, ComposeArgs>(
      'base::compose',
      composeOptions
    ),
  atomWalker: (data, _, apply, context) => {
    context.walk('base::compose', data, composeOptions, apply);
  },
  mergeData: async (target, source, _, context) => {
    const result = await context.merge<'base::compose', ComposeArgs>(
      'base::compose',
      target,
      source,
      composeOptions
    );

    const [atlasFile] = result.atlas;
    const shadowAtlasFile = target.shadowAtlas;

    let resultShadowAtlas: ObjectId;

    const args = { textureIds: result.images };

    if (shadowAtlasFile) {
      await shadowAtlasOrchestration.patch(shadowAtlasFile, atlasFile, args);

      resultShadowAtlas = shadowAtlasFile;
    } else {
      resultShadowAtlas = await shadowAtlasOrchestration.upload(
        atlasFile,
        args
      );
    }

    return {
      ...result,
      shadowAtlas: resultShadowAtlas,
    };
  },
  storageTransformer: {
    getDefaultData: () => ({
      atlas: [],
      images: [],
      skeleton: [],
    }),
    toStorage: async (data, _, context) => {
      const base = await context.toStorage<ComposeId, ComposeArgs>(
        'base::compose',
        data,
        composeOptions
      );

      return {
        ...base,
        shadowAtlas: await shadowAtlasOrchestration.upload(base.atlas[0], {
          textureIds: base.images,
        }),
      };
    },
    fromStorage: async (data, _, context) => {
      const images = await context.fromStorage(
        'base::file',
        data.images,
        IMAGES_OPTIONS
      );
      const atlas = await context.fromStorage(
        'base::file',
        data.shadowAtlas ? [data.shadowAtlas] : data.atlas,
        ATLAS_OPTIONS
      );
      const skeleton = await context.fromStorage(
        'base::file',
        data.skeleton,
        SKELETON_OPTIONS
      );

      const originalAtlas = await context.fromStorage(
        'base::file',
        data.atlas,
        ATLAS_OPTIONS
      );

      return { images, atlas, skeleton, originalAtlas: originalAtlas[0] };
    },
  },
});
