import fsp from 'node:fs/promises';
import path from 'node:path';

import { test } from 'vitest';

import { maxRects } from '../algorithms/maxRects.js';
import { buildSpritesheetImage } from '../build.js';
import { createSpritesheetMap } from '../mapping.js';

async function image(fileName: string) {
  const filePath = path.join(import.meta.dirname, 'assets', fileName);

  return await fsp.readFile(filePath);
}

test('smoke', async () => {
  const map = await createSpritesheetMap({
    algorithm: maxRects,
    images: {
      sprite1: await image('sprite1.jpg'),
      sprite2: await image('sprite2.png'),
    },
  });

  const outputPath = path.join(
    import.meta.dirname,
    '.output',
    'buildSpritesheetImage_smoke_result.png'
  );

  await fsp.mkdir(path.dirname(outputPath), { recursive: true });

  const spritesheetImage = await buildSpritesheetImage(map);

  await spritesheetImage.png().toFile(outputPath);
});
