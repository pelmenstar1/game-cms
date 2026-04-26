import { defineComponentController } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import { ComposeId, composeId } from '../../types/compose.js';
import { createShadowFileOrchestration } from '../../utils/shadowFile.js';
import core from './core.js';
import {
  ATLAS_OPTIONS,
  type ComposeArgs,
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
  validator: (data, _, context, params) => {
    return context.validate<ComposeId, ComposeArgs>(
      composeId,
      data,
      composeOptions,
      params
    );
  },
  structure: (_, context) =>
    context.getStructure<ComposeId, ComposeArgs>(composeId, composeOptions),
  innerDependencies: (_, context) =>
    context.getDependencies<ComposeId, ComposeArgs>(composeId, composeOptions),
  migrate: (data, _, context) =>
    context.migrate<ComposeId, ComposeArgs>(composeId, data, composeOptions),
  resolver: (data, _, context, args) =>
    context.resolveOutData<ComposeId, ComposeArgs>(
      composeId,
      data,
      composeOptions,
      args
    ) as never,
  mergeData: async (target, source, _, context) => {
    const result = await context.merge<ComposeId, ComposeArgs>(
      composeId,
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
  atomWalker: {
    applyEach: (data, _, apply, context) => {
      context.applyEach(composeId, data, composeOptions, apply);
    },
    filter: (data, _, predicate, context) =>
      context.filter<ComposeId, ComposeArgs>(
        composeId,
        data,
        composeOptions,
        predicate
      ),
  },
  search: {
    getScore: (query, target, _, context) =>
      context.getScore<ComposeId, ComposeArgs>(
        query,
        composeId,
        target,
        composeOptions
      ),
    createIndex: (storage, _, context) => {
      return context.createSearchIndex<ComposeId, ComposeArgs>(
        composeId,
        storage,
        composeOptions
      );
    },
  },
  outerLinkController: {
    contains: (outerLink, data, _, context) =>
      context.contains(outerLink, composeId, data, composeOptions),
    delete: (outerLink, data, _, context) =>
      context.delete<ComposeId, ComposeArgs>(
        outerLink,
        composeId,
        data,
        composeOptions
      ),
  },
  storageTransformer: {
    getDefaultData: () => ({
      atlas: [],
      images: [],
      skeleton: [],
    }),
    toStorage: async (data, _, context) => {
      const base = await context.toStorage<ComposeId, ComposeArgs>(
        composeId,
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
    disposeData: async (data) => {
      const { shadowAtlas } = data;

      if (shadowAtlas) {
        await cms().service('base::storage').deleteById(shadowAtlas);
      }
    },
  },
});
