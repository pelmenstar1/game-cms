import {
  type ComponentOptionsById,
  type ComponentRawInDataById,
  defineComponentController,
  type ForeignComponentStorageDataResolverContext,
} from '@game-cms/core';
import { cms } from '@game-cms/global';
import { asyncMapObject } from '@game-cms/shared/object';
import {
  buildSpritesheetAtlas,
  buildSpritesheetImage,
  createSpritesheetMap,
  maxRects,
} from '@game-cms/spritesheet';
import { ObjectId } from 'mongodb';

import core from './core.js';
import type {
  SpritesheetBundleStorageMap,
  SpritesheetStorageEntry,
} from './types.js';

type Id = 'game::spritesheet-wrapper';
type File = ComponentRawInDataById<'base::file'>[number];

function splitDataToBundles<Args>(
  data: ComponentRawInDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentStorageDataResolverContext
) {
  const bundles: string[] = [];
  const images: File[] = [];
  const names: string[] = [];

  context.applyAtPath(
    options.componentId,
    data,
    options.baseOptions,
    options.bundlePath,
    (result) => {
      bundles.push(result as string);
    }
  );

  context.applyAtPath(
    options.componentId,
    data,
    options.baseOptions,
    options.imagePath,
    (result) => {
      if (Array.isArray(result)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const [image] = result;

        if (typeof image === 'string') {
          images.push(image);
        }
      }
    }
  );

  context.applyAtPath(
    options.componentId,
    data,
    options.baseOptions,
    options.namePath,
    (result) => {
      names.push(result as string);
    }
  );

  const result: Record<string, { id: File; name: string }[]> = {};

  for (let i = 0; i < images.length; i++) {
    const bundle = bundles[i];

    let list = result[bundle];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (list === undefined) {
      list = [];
      result[bundle] = list;
    }

    list.push({ id: images[i], name: names[i] });
  }

  return result;
}

async function generateSpritesheet(
  images: { id: string; name: string }[]
): Promise<SpritesheetStorageEntry> {
  const storageService = cms().service('base::storage');

  const imageEntries = await Promise.all(
    images.map(async ({ id, name }) => {
      const content = await storageService.getContent(new ObjectId(id));

      return [name, content] as const;
    })
  );

  const map = await createSpritesheetMap({
    algorithm: maxRects,
    images: Object.fromEntries(imageEntries),
  });

  const atlas = buildSpritesheetAtlas(map);
  const spriteImage = buildSpritesheetImage(map).png();

  const { id: imageId } = await storageService.uploadFile({
    name: 'spritesheet.png',
    mime: 'image/png',
    content: spriteImage,
    hidden: true,
  });

  const { id: atlasId } = await storageService.uploadFile({
    name: 'spritesheet.json',
    mime: 'application/json',
    content: Buffer.from(JSON.stringify(atlas), 'utf8'),
    hidden: true,
  });

  return { atlasId, imageId };
}

async function generateSpritesheets<Args>(
  data: ComponentRawInDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentStorageDataResolverContext
): Promise<SpritesheetBundleStorageMap> {
  const bundles = splitDataToBundles(data, options, context);

  return asyncMapObject(bundles, (images) => generateSpritesheet(images));
}

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  migrate: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return {
      base: context.migrate(componentId, data, baseOptions),
      spritesheets: {},
    };
  },
  resolver: (data, options, context, args) => {
    const { componentId, baseOptions } = options;

    return context.resolveRawData(componentId, data, baseOptions, args);
  },
  pathWalker: (data, options, path, apply, context) => {
    context.applyAtPath(
      options.componentId,
      data,
      options.baseOptions,
      path,
      apply
    );
  },
  mergeData: async (target, source, options, context) => {
    const mergedBase = await context.merge(
      options.componentId,
      target.base,
      source,
      options.baseOptions
    );

    // TODO: Fix spritesheets
    return {
      base: mergedBase,
      spritesheets: target.spritesheets,
    };
  },
  storageTransformer: {
    getDefaultData: (options, context) => {
      const { componentId, baseOptions } = options;

      return {
        base: context.getDefaultData(componentId, baseOptions),
        spritesheets: {},
      };
    },
    fromStorage: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      const spritesheets = await asyncMapObject(
        data.spritesheets,
        async (entry) => {
          const [atlasFile] = await context.fromStorage(
            'base::file',
            [entry.atlasId],
            {}
          );

          const [imageFile] = await context.fromStorage(
            'base::file',
            [entry.imageId],
            {}
          );

          return {
            atlasUrl: (atlasFile as unknown as { url: string }).url,
            imageUrl: (imageFile as unknown as { url: string }).url,
          };
        }
      );

      return {
        base: await context.fromStorage(componentId, data.base, baseOptions),
        spritesheets,
      };
    },
    toStorage: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      const spritesheets = await generateSpritesheets(data, options, context);

      return {
        base: await context.toStorage(componentId, data, baseOptions),
        spritesheets,
      };
    },
  },
});
