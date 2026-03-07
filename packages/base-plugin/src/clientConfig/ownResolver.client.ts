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
      dashboard: {
        tabs: mergeArrays(base.dashboard?.tabs, next.dashboard?.tabs),
        settings: {
          tabs: mergeArrays(
            base.dashboard?.settings?.tabs,
            next.dashboard?.settings?.tabs
          ),
        },
      },
    };
  },
} satisfies PluginClientConfigResolver<OwnPluginClientConfig>;
