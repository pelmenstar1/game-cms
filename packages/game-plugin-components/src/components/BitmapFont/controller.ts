import { defineComponentController } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import core from './core.js';
import { ATLAS_MIME_TYPE } from './internal/constants.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';
import { createShadowAtlasContent } from './internal/shadowAtlas.js';

async function loadShadowAtlasContent(
  atlasId: ObjectId,
  textureIds: ObjectId[]
): Promise<string> {
  const atlasContent = await cms()
    .service('base::storage')
    .getContent(atlasId, { encoding: 'utf8' });

  const textureUrls = await Promise.all(
    textureIds.map((id) => cms().service('base::storage').getUrl(id))
  );

  return createShadowAtlasContent(atlasContent, textureUrls);
}

async function uploadShadowAtlas(
  originalAtlasId: ObjectId,
  textureIds: ObjectId[]
): Promise<ObjectId> {
  const shadowContent = await loadShadowAtlasContent(
    originalAtlasId,
    textureIds
  );

  const { id: shadowAtlasId } = await cms()
    .service('base::storage')
    .uploadFile({
      name: 'shadow-atlas.fnt',
      mime: ATLAS_MIME_TYPE,
      content: Buffer.from(shadowContent, 'utf8'),
      hidden: true,
    });

  return shadowAtlasId;
}

async function patchShadowAtlas(
  originalAtlasId: ObjectId,
  shadowAtlasId: ObjectId,
  textureIds: ObjectId[]
) {
  const shadowContent = await loadShadowAtlasContent(
    originalAtlasId,
    textureIds
  );

  await cms()
    .service('base::storage')
    .patchContent(shadowAtlasId, Buffer.from(shadowContent, 'utf8'));

  return shadowAtlasId;
}

export default defineComponentController({
  core,
  structure: (_, context) =>
    context.getStructure<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions()
    ),
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (atlasFile && shadowAtlasFile) {
      await patchShadowAtlas(atlasFile, shadowAtlasFile, result.pages);

      resultShadowAtlas = shadowAtlasFile;
    } else {
      resultShadowAtlas = await uploadShadowAtlas(atlasFile, result.pages);
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
        shadowAtlas: await uploadShadowAtlas(atlasIds[0], pageIds),
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
        [data.shadowAtlas],
        options.atlas.options
      );

      return { pages, atlas };
    },
  },
});
