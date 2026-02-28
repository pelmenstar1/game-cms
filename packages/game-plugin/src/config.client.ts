import { PluginClientConfig } from '@game-cms/base-core';

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
  },
} satisfies PluginClientConfig;
