import { defineComponentController } from '@game-cms/core';
import { ObjectId } from 'mongodb';

import { createShadowFileOrchestration } from '../../utils/shadowFile.js';
import core from './core.js';
import { ATLAS_MIME_TYPE } from './internal/constants.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';
import { createShadowAtlasContent } from './internal/shadowAtlas.js';

const shadowAtlasOrchestration = createShadowFileOrchestration({
  shadowName: 'shadow-atlas.fnt',
  mime: ATLAS_MIME_TYPE,
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
  validator: (data, _, context) =>
    context.validate<'base::compose', ComposeArgs>(
      'base::compose',
      data,
      getComposeOptions()
    ),
  structure: (_, context) =>
    context.getStructure<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions()
    ),
  atomWalker: (data, _, apply, context) => {
    context.walk('base::compose', data, getComposeOptions(), apply);
  },
  mergeData: async (target, source, _, context) => {
    const result = await context.merge<'base::compose', ComposeArgs>(
      'base::compose',
      target,
      source,
      getComposeOptions()
    );

    const [atlasFile] = result.atlas;
    const shadowAtlasFile = target.shadowAtlas;

    let resultShadowAtlas: ObjectId;

    const args = { textureIds: result.pages };

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
    createIndex: (data, _, context) =>
      context.createSearchIndex<'base::compose', ComposeArgs>(
        'base::compose',
        data,
        getComposeOptions()
      ),
    getScore: (query, target, _, context) =>
      context.getScore<'base::compose', ComposeArgs>(
        query,
        'base::compose',
        target,
        getComposeOptions()
      ),
  },
  storageTransformer: {
    getDefaultData: (_, context) => {
      const options = getComposeOptions();

      const atlasDefault = context.getDefaultData(
        'base::file',
        options.atlas.options
      );

      return {
        atlas: atlasDefault,
        shadowAtlas: atlasDefault[0],
        pages: context.getDefaultData('base::file', options.pages.options),
      };
    },
    toStorage: async (data, _, context) => {
      const options = getComposeOptions();

      const atlasIds = await context.toStorage(
        'base::file',
        data.atlas,
        options.atlas.options
      );

      const pageIds = await context.toStorage(
        'base::file',
        data.pages,
        options.pages.options
      );

      return {
        atlas: [atlasIds[0]],
        pages: pageIds,
        shadowAtlas: await shadowAtlasOrchestration.upload(atlasIds[0], {
          textureIds: pageIds,
        }),
      };
    },
    fromStorage: async (data, _, context) => {
      const options = getComposeOptions();

      const pages = await context.fromStorage(
        'base::file',
        data.pages,
        options.pages.options
      );
      const atlas = await context.fromStorage(
        'base::file',
        data.shadowAtlas ? [data.shadowAtlas] : data.atlas,
        options.atlas.options
      );

      const originalAtlas = await context.fromStorage(
        'base::file',
        data.atlas,
        options.atlas.options
      );

      return { pages, atlas, originalAtlas: originalAtlas[0] };
    },
  },
});
