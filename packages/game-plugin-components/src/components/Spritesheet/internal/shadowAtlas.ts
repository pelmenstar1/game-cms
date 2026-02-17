import { parseJsonWithSchema } from '@game-cms/shared/json';
import { getUrlFileName } from '@game-cms/shared/string';

import { spritesheetDataWithSize } from '../../../utils/spritesheet/schema.js';

export function createShadowAtlasContent(
  atlasContent: string,
  textureUrl: string
): string {
  const atlas = parseJsonWithSchema(atlasContent, spritesheetDataWithSize);
  atlas.meta.image = getUrlFileName(textureUrl);

  return JSON.stringify(atlas, null, 2);
}
