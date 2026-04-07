import { defineComponentController } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import { ComposeId, composeId } from '../../types/compose.js';
import { createShadowFileOrchestration } from '../../utils/shadowFile.js';
import core from './core.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';
import { createShadowAtlasContent } from './internal/shadowAtlas.js';

const shadowAtlasOrchestration = createShadowFileOrchestration({
  shadowName: 'atlas.json',
  mime: 'application/json',
  getContent: async (atlasContent, args: { textureId: ObjectId }, context) => {
    const textureUrl = await context.getUrl(args.textureId);

    return createShadowAtlasContent(atlasContent, textureUrl);
  },
});

export default defineComponentController({
  core,
  validator: (data, options, context) =>
    context.validate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions(options)
    ),
  structure: (options, context) =>
    context.getStructure<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions(options)
    ),
  innerDependencies: (options, context) =>
    context.getDependencies<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions(options)
    ),
  atomWalker: (data, options, apply, context) => {
    context.walk(composeId, data, getComposeOptions(options), apply);
  },
  mergeData: async (target, source, options, context) => {
    const result = await context.merge<ComposeId, ComposeArgs>(
      composeId,
      target,
      source,
      getComposeOptions(options)
    );

    const [atlasFile] = result.atlas;
    const shadowAtlasFile = target.shadowAtlas;

    let resultShadowAtlas: ObjectId;

    const args = { textureId: result.texture[0] };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (atlasFile && shadowAtlasFile) {
      await shadowAtlasOrchestration.patch(atlasFile, shadowAtlasFile, args);

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
  search: {
    createIndex: (data, options, context) =>
      context.createSearchIndex<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(options)
      ),
    getScore: (query, target, options, context) =>
      context.getScore<ComposeId, ComposeArgs>(
        query,
        composeId,
        target,
        getComposeOptions(options)
      ),
  },
  storageTransformer: {
    getDefaultData: (options, context) => {
      const composeOptions = getComposeOptions(options);

      const atlasDefault = context.getDefaultData(
        'base::file',
        composeOptions.atlas.options
      );

      return {
        atlas: atlasDefault,
        shadowAtlas: atlasDefault[0],
        texture: context.getDefaultData(
          'base::file',
          composeOptions.texture.options
        ),
      };
    },
    toStorage: async (data, options, context) => {
      const composeOptions = getComposeOptions(options);

      const atlasIds = await context.toStorage(
        'base::file',
        data.atlas,
        composeOptions.atlas.options
      );

      const textureIds = await context.toStorage(
        'base::file',
        data.texture,
        composeOptions.texture.options
      );

      return {
        atlas: [atlasIds[0]],
        texture: textureIds,
        shadowAtlas: await shadowAtlasOrchestration.upload(atlasIds[0], {
          textureId: textureIds[0],
        }),
      };
    },
    fromStorage: async (data, options, context) => {
      const composeOptions = getComposeOptions(options);

      const texture = await context.fromStorage(
        'base::file',
        data.texture,
        composeOptions.texture.options
      );
      const atlas = await context.fromStorage(
        'base::file',
        data.shadowAtlas ? [data.shadowAtlas] : data.atlas,
        composeOptions.atlas.options
      );

      const originalAtlas = await context.fromStorage(
        'base::file',
        data.atlas,
        composeOptions.atlas.options
      );

      return { texture, atlas, originalAtlas: originalAtlas[0] };
    },
    disposeData: async (data) => {
      const { shadowAtlas } = data;

      if (shadowAtlas) {
        await cms().service('base::storage').deleteById(shadowAtlas);
      }
    },
  },
});
