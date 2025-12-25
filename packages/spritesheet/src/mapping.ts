import sharp from 'sharp';

import { inferRectsBounds } from './internal/rect.js';
import type {
  Size,
  SpritesheetMap,
  SpritesheetMappingAlgorithm,
} from './types.js';

export type CreateSpritesheetMapOptions = {
  algorithm: SpritesheetMappingAlgorithm;
  limits: Size;
  images: Record<string, Buffer>;
};

export async function createSpritesheetMap(
  options: CreateSpritesheetMapOptions
): Promise<SpritesheetMap> {
  const { algorithm, images, limits } = options;

  const taggedRects = await Promise.all(
    Object.entries(images).map(async ([name, source]) => {
      const { width, height } = await sharp(source).metadata();

      return { tag: { name, source, width, height }, width, height };
    })
  );

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
