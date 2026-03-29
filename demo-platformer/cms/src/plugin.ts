import path from 'node:path';

import { scanDirectorySource } from '@game-cms/core/node';
import { tsDefaultModuleImporter } from '@game-cms/shared/node';
import { Plugin } from 'game-cms';

export const cmsPlugin: Plugin = {
  id: 'cms',
  config: {
    api: {
      routes: scanDirectorySource(
        path.join(import.meta.dirname, 'routes'),
        tsDefaultModuleImporter(import.meta.url)
      ),
    },
  },
};
