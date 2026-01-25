import type { Size } from '@game-cms/shared';
import { asyncMapObject } from '@game-cms/shared/object';
import sharp from 'sharp';

import { inferRectsBounds } from './internal/rect.js';
import type { SpritesheetMap, SpritesheetMappingAlgorithm } from './types.js';

export type CreateSpritesheetMapOptions = {
  algorithm: SpritesheetMappingAlgorithm;
  images: Record<string, Uint8Array>;
};

function inferLimits(sizeMap: Record<string, Size>): Size {
  const sizes = Object.values(sizeMap);
  let maxWidth = Number.NEGATIVE_INFINITY;
  let totalHeight = 0;

  for (const { width, height } of sizes) {
    if (width > maxWidth) {
      maxWidth = width;
    }

    totalHeight += height;
  }

  return { width: maxWidth, height: totalHeight };
}

export async function createSpritesheetMap(
  options: CreateSpritesheetMapOptions
): Promise<SpritesheetMap> {
  const { algorithm, images } = options;

  const imageSizes = await asyncMapObject(images, async (source) => {
    const { width, height } = await sharp(source).metadata();

    return { width, height };
  });

  const taggedRects = Object.entries(images).map(([name, source]) => {
    const { width, height } = imageSizes[name];

    return { tag: { name, source, width, height }, width, height };
  });

  const limits = inferLimits(imageSizes);

  const { rects } = algorithm(taggedRects, limits);

  return {
    entries: rects.map((rect) => {
      const {
        name,
        source,
        width: originalWidth,
        height: originalHeight,
      } = rect.tag;

      return {
        source: {
          data: source,
          size: { width: originalWidth, height: originalHeight },
        },
        target: {
          tag: name,
          x: rect.x,
          y: rect.y,
          width: rect.height,
          height: rect.height,
          rotated: rect.rotated,
        },
      };
    }),
    output: {
      bounds: inferRectsBounds(rects),
    },
  };
}
