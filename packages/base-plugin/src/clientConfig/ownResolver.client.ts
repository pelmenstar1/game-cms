import {
  OwnPluginClientConfig,
  PluginClientConfigResolver,
} from '@game-cms/base-core';
import { mergeArrays } from '@game-cms/shared/collections';

export default {
  mergeConfigs: (base, next) => {
    return {
      filePreviews: {
        inline: mergeArrays(
          base.filePreviews?.inline,
          next.filePreviews?.inline
        ),
        fullScale: mergeArrays(
          base.filePreviews?.fullScale,
          next.filePreviews?.fullScale
        ),
      },
      settings: {
        tabs: { ...base.settings?.tabs, ...next.settings?.tabs },
      },
    };
  },
} satisfies PluginClientConfigResolver<OwnPluginClientConfig>;
