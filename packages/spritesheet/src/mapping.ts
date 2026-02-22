import type { Size } from '@game-cms/shared';
import sharp from 'sharp';

import { inferRectsBounds } from './internal/rect.js';
import type { SpritesheetMap, SpritesheetMappingAlgorithm } from './types.js';

export type CreateSpritesheetMapOptions = {
  algorithm: SpritesheetMappingAlgorithm;
  images: Record<string, Uint8Array>;
};

function inferLimits(rects: Size[]): Size {
  let maxWidth = Number.NEGATIVE_INFINITY;
  let totalHeight = 0;

  for (const { width, height } of rects) {
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

  const taggedRects = await Promise.all(
    Object.entries(images).map(async ([name, source]) => {
      const { width, height } = await sharp(source).metadata();

      return { tag: { name, source, width, height }, width, height };
    })
  );

  const limits = inferLimits(taggedRects);

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
          width: rect.width,
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
