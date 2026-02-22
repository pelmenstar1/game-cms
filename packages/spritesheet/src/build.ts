import type { SpritesheetData, SpritesheetFrameData } from 'pixi.js';
import sharp, { type Color } from 'sharp';

import type { SpritesheetMap } from './types.js';

const TRANSPARENT: Color = { r: 0, g: 0, b: 0, alpha: 0 };

function preRotateImages(map: SpritesheetMap) {
  return Promise.all(
    map.entries.map(async (entry) => {
      const { data } = entry.source;

      if (entry.target.rotated) {
        return sharp(data).rotate(90).toBuffer();
      }

      return Buffer.from(data);
    })
  );
}

export async function buildSpritesheetImage(map: SpritesheetMap) {
  const { bounds } = map.output;

  const rotatedImages = await preRotateImages(map);

  return sharp({
    create: {
      channels: 4,
      background: TRANSPARENT,
      width: bounds.width,
      height: bounds.height,
    },
  }).composite(
    map.entries.map(({ target }, index) => ({
      input: rotatedImages[index],
      left: target.x - bounds.x,
      top: target.y - bounds.y,
    }))
  );
}

export function buildSpritesheetAtlas(map: SpritesheetMap): SpritesheetData {
  const { bounds } = map.output;

  return {
    frames: Object.fromEntries(
      map.entries.map(({ target, source }) => {
        const frameData: SpritesheetFrameData = {
          frame: {
            x: target.x,
            y: target.y,
            w: source.size.width,
            h: source.size.height,
          },
          rotated: target.rotated,
        };

        return [target.tag, frameData] as const;
      })
    ),
    meta: {
      scale: 1,
      format: 'RGBA8888',
      size: {
        w: bounds.width,
        h: bounds.height,
      },
    },
  };
}
