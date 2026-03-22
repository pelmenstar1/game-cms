import path from 'node:path';

import { componentDistributionTest } from '@game-cms/component-testing-lib';
import { test } from 'vitest';

test('component distribution', async () => {
  await componentDistributionTest(
    path.join(import.meta.dirname, '../../dist/src/components')
  );
});
