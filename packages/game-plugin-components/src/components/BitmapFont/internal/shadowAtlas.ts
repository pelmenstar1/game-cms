import { MaybeArray } from '@game-cms/shared/collections';
import { getUrlFileName } from '@game-cms/shared/string';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

type PageContent = { '@_file': string };

type AtlasContent = {
  font: {
    pages: { page: MaybeArray<PageContent> };
  };
};

export function createShadowAtlasContent(
  atlasContent: string,
  textureUrls: string[]
): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const doc = parser.parse(atlasContent) as AtlasContent;
  const { page } = doc.font.pages;

  if (Array.isArray(page)) {
    for (let i = 0; i < textureUrls.length; i++) {
      const pageEntry = page[i];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (pageEntry) {
        pageEntry['@_file'] = getUrlFileName(textureUrls[i]);
      }
    }
  } else {
    page['@_file'] = getUrlFileName(textureUrls[0]);
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
  });

  return builder.build(doc);
}
