import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CmsEnvironment, setEnvironment } from '@game-cms/global';
import { test } from 'vitest';

import { gatherComponents } from './gather';

test('gatherComponents', async () => {
  const baseComponentsDistPath = fileURLToPath(
    import.meta.resolve('@game-cms/base-components')
  );

  setEnvironment({
    components: {
      distributions: [
        {
          pluginId: 'base',
          directoryPath: path.join(
            path.dirname(baseComponentsDistPath),
            'components'
          ),
        },
      ],
    },
  } as CmsEnvironment);

  await gatherComponents();
});
