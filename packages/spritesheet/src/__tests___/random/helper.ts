import { lerpInt, seededRandom } from '@game-cms/shared';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import { describe, expect, test } from 'vitest';

import { buildSpritesheetImage } from '../../build.js';
import { createSpritesheetMap } from '../../mapping.js';
import { SpritesheetMappingAlgorithm } from '../../types.js';

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  alpha: number;
}

const random = seededRandom(123);

const randomLerp = (min: number, max: number) => lerpInt(min, max, random());

function randomColor(): RgbaColor {
  return {
    r: randomLerp(0, 255),
    g: randomLerp(0, 255),
    b: randomLerp(0, 255),
    alpha: 255,
  };
}

interface SourceImage {
  png: Buffer;
  raw: Buffer;
  width: number;
  height: number;
}

async function colorImage(width: number, height: number): Promise<SourceImage> {
  const color = randomColor();
  const raw = Buffer.allocUnsafe(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    raw[i * 4] = color.r;
    raw[i * 4 + 1] = color.g;
    raw[i * 4 + 2] = color.b;
    raw[i * 4 + 3] = color.alpha;
  }

  const png = await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();

  return { png, raw, width, height };
}

function cropRaw(
  buf: Buffer,
  imgW: number,
  x: number,
  y: number,
  w: number,
  h: number
): Buffer {
  const out = Buffer.allocUnsafe(w * h * 4);

  for (let row = 0; row < h; row++) {
    buf.copy(
      out,
      row * w * 4,
      ((y + row) * imgW + x) * 4,
      ((y + row) * imgW + x + w) * 4
    );
  }

  return out;
}

// Un-rotate a buffer stored at +90° CW back to original orientation (-90° = CCW)
function rotateRaw90CCW(buf: Buffer, w: number, h: number): Buffer {
  // input dimensions: w × h (rotated) → output: h × w (original)
  const out = Buffer.allocUnsafe(w * h * 4);

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const src = (r * w + c) * 4;
      const dst = ((w - 1 - c) * h + r) * 4;

      buf.copy(out, dst, src, src + 4);
    }
  }
  return out;
}

function validateRaw(
  expected: Buffer,
  actual: Buffer,
  width: number,
  height: number
) {
  expect(expected.length).toEqual(actual.length);

  const unmatchedPixels = pixelmatch(
    expected,
    actual,
    undefined,
    width,
    height
  );

  expect(unmatchedPixels).toEqual(0);
}

async function testCase(
  nRects: number,
  algorithm: SpritesheetMappingAlgorithm
) {
  const sourceImages = await Promise.all(
    Array.from({ length: nRects }, async (_, i) => {
      const img = await colorImage(randomLerp(10, 100), randomLerp(10, 100));
      return [`n${i}`, img] as const;
    })
  );

  const images = Object.fromEntries(sourceImages.map(([k, v]) => [k, v.png]));

  const map = await createSpritesheetMap({ algorithm, images });

  const spritesheetImageBuilder = await buildSpritesheetImage(map);
  const spritesheetPng = await spritesheetImageBuilder.png().toBuffer();

  const { data: sheetRaw, info } = await sharp(spritesheetPng)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (const [key, source] of sourceImages) {
    const entry = map.entries.find((e) => e.target.tag === key);
    if (!entry) {
      throw new Error(`Entry not found for key: ${key}`);
    }

    const { x, y, width, height, rotated } = entry.target;

    let cropped = cropRaw(sheetRaw, info.width, x, y, width, height);

    if (rotated) {
      cropped = rotateRaw90CCW(cropped, width, height);
    }

    validateRaw(source.raw, cropped, source.width, source.height);
  }
}

export function spritesheetRandomTestsHelper(
  name: string,
  algorithm: SpritesheetMappingAlgorithm
) {
  describe(`spritesheet e2e - ${name}`, () => {
    for (let i = 0; i < 200; i++) {
      test(`n. ${i}`, async () => {
        const nRects = randomLerp(2, 20);

        await testCase(nRects, algorithm);
      });
    }
  });
}
