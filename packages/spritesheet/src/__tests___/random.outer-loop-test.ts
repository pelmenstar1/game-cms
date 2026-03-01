import { lerpInt, seededRandom } from '@game-cms/shared';
import pixelmatch from 'pixelmatch';
import sharp, { Color } from 'sharp';
import { describe, expect, test } from 'vitest';

import { maxRects } from '../algorithms/maxRects.js';
import { buildSpritesheetImage } from '../build.js';
import { createSpritesheetMap } from '../mapping.js';
import { SpriteRect } from '../types.js';

const random = seededRandom(123);

const randomLerp = (min: number, max: number) => lerpInt(min, max, random());

function randomColor(): Color {
  return {
    r: randomLerp(0, 255),
    g: randomLerp(0, 255),
    b: randomLerp(0, 255),
    alpha: 255,
  };
}

async function colorImage(width: number, height: number) {
  return sharp({
    create: {
      width,
      height,
      background: randomColor(),
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

async function validateSameImage(image1: Buffer, image2: Buffer) {
  const img1 = sharp(image1);
  const img2 = sharp(image2);

  const [
    { width: width1, height: height1 },
    { width: width2, height: height2 },
  ] = await Promise.all([img1.metadata(), img2.metadata()]);

  expect(width1).toEqual(width2);
  expect(height1).toEqual(height2);

  const [raw1, raw2] = await Promise.all([
    img1.raw().toBuffer(),
    img2.raw().toBuffer(),
  ]);

  const unmatchedPixels = pixelmatch(raw1, raw2, undefined, width1, height1);

  expect(unmatchedPixels).toEqual(0);
}

async function cropSpriteImage(
  spritesheetImage: Buffer,
  entry: SpriteRect<string>
) {
  const { x, y, width, height, rotated } = entry;

  const builder = sharp(spritesheetImage).extract({
    left: x,
    top: y,
    width,
    height,
  });

  if (rotated) {
    builder.rotate(-90);
  }

  return builder.png().toBuffer();
}

async function testCase(nRects: number) {
  const images = Object.fromEntries(
    await Promise.all(
      Array.from({ length: nRects })
        .fill(0)
        .map(
          async (_, i) =>
            [
              `n${i}`,
              await colorImage(randomLerp(10, 100), randomLerp(10, 100)),
            ] as const
        )
    )
  );

  const map = await createSpritesheetMap({
    algorithm: maxRects,
    images,
  });

  const spritesheetImageBuilder = await buildSpritesheetImage(map);

  const spritesheetImage = await spritesheetImageBuilder.png().toBuffer();

  await Promise.all(
    Object.entries(images).map(async ([key, expectedImage]) => {
      const entry = map.entries.find((entry) => entry.target.tag === key);
      if (!entry) {
        throw new Error(`Entry not found for key: ${key}`);
      }

      const actualImage = await cropSpriteImage(spritesheetImage, entry.target);

      await validateSameImage(expectedImage, actualImage);
    })
  );
}

describe('spritesheet e2e', () => {
  for (let i = 0; i < 200; i++) {
    test(`n. ${i}`, async () => {
      const nRects = randomLerp(2, 20);

      await testCase(nRects);
    });
  }
});
