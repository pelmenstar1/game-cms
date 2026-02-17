import { getUrlFileName } from '@game-cms/shared/string';

function patchPageUrl(page: string, textureUrl: string): string {
  const newLineIndex = page.indexOf('\n');
  if (newLineIndex === -1) {
    return page;
  }

  const rest = page.slice(newLineIndex);

  return `${getUrlFileName(textureUrl)}${rest}`;
}

export function createShadowAtlasContent(
  atlasContent: string,
  textureUrls: string[]
): string {
  const pages = atlasContent.split('\n\n');
  if (pages.length !== textureUrls.length) {
    throw new Error(
      'The number of texture URLs must match the number of pages in the atlas'
    );
  }

  return pages
    .map((page, index) => patchPageUrl(page, textureUrls[index]))
    .join('\n\n');
}
