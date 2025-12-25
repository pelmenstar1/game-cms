import type { SpritesheetData, SpritesheetFrameData } from 'pixi.js';
import sharp, { type Color } from 'sharp';

import type { SpritesheetMap } from './types.js';

const TRANSPARENT: Color = { r: 0, g: 0, b: 0, alpha: 0 };

export function buildSpritesheetImage(map: SpritesheetMap) {
  const { bounds } = map.output;

  return sharp({
    create: {
      channels: 4,
      background: TRANSPARENT,
      width: bounds.width,
      height: bounds.height,
    },
  }).composite(
    map.entries.map((entry) => ({
      input: entry.source.data,
      left: entry.target.x - bounds.x,
      top: entry.target.y - bounds.y,
    }))
  );
}

export function buildSpritesheetAtlas(map: SpritesheetMap): SpritesheetData {
  return {
    frames: Object.fromEntries(
      map.entries.map((entry) => {
        const frameData: SpritesheetFrameData = {
          frame: {
            x: entry.target.x,
            y: entry.target.y,
            w: entry.source.size.width,
            h: entry.source.size.height,
          },
        };

        return [entry.target.tag, frameData] as const;
      })
    ),
    meta: {
      scale: 1,
    },
  };
}
