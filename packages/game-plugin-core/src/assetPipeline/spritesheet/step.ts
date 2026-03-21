import { cms } from '@game-cms/global';
import { asyncMapObject } from '@game-cms/shared/object';
import {
  buildSpritesheetAtlas,
  buildSpritesheetImage,
  createSpritesheetMap,
  maxRects,
  SpritesheetMappingAlgorithm,
} from '@game-cms/spritesheet';
import { ObjectId } from 'mongodb';

import { defineGameAssetPipelineStep } from '../core.js';
import { SpritesheetStepSource } from './source.js';
import { SpritesheetStorageEntry } from './types.js';

async function generateSpritesheet(
  images: { file: string; name: string }[],
  algorithm: SpritesheetMappingAlgorithm = maxRects
): Promise<SpritesheetStorageEntry> {
  const storageService = cms().service('base::storage');

  const imageEntries = await Promise.all(
    images.map(async ({ file, name }) => {
      const content = await storageService.getContent(new ObjectId(file));

      return [name, content] as const;
    })
  );

  const map = await createSpritesheetMap({
    algorithm,
    images: Object.fromEntries(imageEntries),
  });

  async function uploadAtlas() {
    const atlas = buildSpritesheetAtlas(map);

    const { id: atlasId } = await storageService.uploadFile({
      name: 'spritesheet.json',
      mime: 'application/json',
      content: Buffer.from(JSON.stringify(atlas), 'utf8'),
      hidden: true,
    });

    return atlasId;
  }

  async function uploadImage() {
    const spriteImageBuilder = await buildSpritesheetImage(map);
    const spriteImage = spriteImageBuilder.png();

    const { id: imageId } = await storageService.uploadFile({
      name: 'spritesheet.png',
      mime: 'image/png',
      content: spriteImage,
      hidden: true,
    });

    return imageId;
  }

  const [atlasId, imageId] = await Promise.all([uploadAtlas(), uploadImage()]);

  return { atlasId, imageId };
}

export type SpritesheetStepOptions = {
  source: SpritesheetStepSource;
  algorithm?: SpritesheetMappingAlgorithm;
};

export function spritesheetStep({ source, algorithm }: SpritesheetStepOptions) {
  return defineGameAssetPipelineStep({
    id: 'spritesheet',
    apply: async (data, options, context) => {
      const bundles = await source(data, options, context);

      return asyncMapObject(bundles, (images) =>
        generateSpritesheet(images, algorithm)
      );
    },
    fromStorage: async (data) => {
      const storageService = cms().service('base::storage');

      return asyncMapObject(data, async (entry) => {
        const [atlasUrl, imageUrl] = await Promise.all([
          storageService.getUrl(entry.atlasId),
          storageService.getUrl(entry.imageId),
        ]);

        return { atlasUrl, imageUrl };
      });
    },
    disposeStorage: async (data) => {
      const storageService = cms().service('base::storage');

      await Promise.all(
        Object.values(data).map((entry) =>
          Promise.all([
            storageService.deleteById(entry.atlasId),
            storageService.deleteById(entry.imageId),
          ])
        )
      );
    },
  });
}
