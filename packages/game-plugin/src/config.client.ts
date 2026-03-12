import {
  fileGroupPreview,
  NamedFilePreviewInputEntry,
  PluginClientConfig,
} from '@game-cms/base-core';
import { matchMime } from '@game-cms/shared';

function findFileWithExtension(
  items: NamedFilePreviewInputEntry[],
  ext: string
) {
  return items.find((item) => item.name.endsWith(ext))?.url;
}

export default {
  filePreviews: {
    fullScale: [
      {
        id: 'game::threeD',
        test: ({ mime }) => mime === 'model/gltf-binary',
        renderer: () =>
          import('@game-cms/game-plugin-components/filePreviews/ThreeD'),
      },
    ],
    group: [
      fileGroupPreview({
        id: 'game::group::spine',
        test: (items) => {
          const atlas = findFileWithExtension(items, '.atlas');
          const skeleton = findFileWithExtension(items, '.json');
          const images = items.filter((item) =>
            matchMime(item.mime, 'image/*')
          );

          if (atlas && skeleton && items.length === images.length + 2) {
            return {
              spine: {
                atlas,
                skeleton,
                images: images.map(({ url }) => url),
              },
            };
          }
        },
        renderer: () =>
          import('@game-cms/game-plugin-components/filePreviews/Spine'),
      }),
    ],
  },
} satisfies PluginClientConfig;
