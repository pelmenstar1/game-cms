import fs from 'node:fs';

import { expect, test } from 'vitest';

import { getFrontendDistributionPath } from './frontendConnector.js';

test('getFrontendDistributionPath', () => {
  const dir = getFrontendDistributionPath();

  expect(fs.existsSync(dir), `'${dir}' does not exist`).toBe(true);
});
