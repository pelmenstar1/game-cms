import { PluginClientConfig } from '@game-cms/base-core';

import { settings as tabs } from './settings';

export default {
  dashboard: {
    settings: {
      tabs,
    },
  },
} satisfies PluginClientConfig;
