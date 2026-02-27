import {
  OwnPluginClientConfig,
  PluginClientConfigResolver,
} from '@game-cms/base-core';

export default {
  mergeConfigs: (base, next) => {
    return {
      filePreviews: {
        inline: [
          ...(base.filePreviews?.inline ?? []),
          ...(next.filePreviews?.inline ?? []),
        ],
        fullScale: [
          ...(base.filePreviews?.fullScale ?? []),
          ...(next.filePreviews?.fullScale ?? []),
        ],
      },
    };
  },
} satisfies PluginClientConfigResolver<OwnPluginClientConfig>;
