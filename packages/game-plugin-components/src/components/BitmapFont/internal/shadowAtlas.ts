import { MaybeArray } from '@game-cms/shared/collections';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

type PageContent = { '@_file': string };

type AtlasContent = {
  font: {
    pages: { page: MaybeArray<PageContent> };
  };
};

export function createShadowAtlasContent(
  atlasContent: string | Uint8Array,
  textureNames: string[]
): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const doc = parser.parse(atlasContent) as AtlasContent;
  const { page } = doc.font.pages;

  if (Array.isArray(page)) {
    for (let i = 0; i < textureNames.length; i++) {
      const pageEntry = page[i];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (pageEntry) {
        pageEntry['@_file'] = textureNames[i];
      }
    }
  } else {
    page['@_file'] = textureNames[0];
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
  });

  return builder.build(doc);
}
