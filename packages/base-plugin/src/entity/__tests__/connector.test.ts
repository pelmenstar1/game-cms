/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { pathToFileURL } from 'node:url';

import { CmsEnvironment, setEnvironment } from '@game-cms/global';
import { createJiti } from 'jiti';
import { expect, test } from 'vitest';

import { emitEntityConnector } from '../connector.js';
import { getEntityEnvConfigSetup } from './utils.js';

test('emitEntityConnector', async () => {
  setEnvironment({
    entity: await getEntityEnvConfigSetup('two-entities'),
  } as CmsEnvironment);

  const jiti = createJiti(import.meta.url);
  const sourceCode = emitEntityConnector();

  const moduleValue: any = jiti.evalModule(sourceCode, {
    id: 'registry.js',
    filename: pathToFileURL('./registry.js').href,
  });

  const expectedRegistry =
    await import('./fixtures/two-entities/entities/registry.client.js');

  expect(moduleValue).toMatchObject({
    entityMetaMap: {
      test: {
        title: 'Test',
      },
      test2: {
        title: 'Test2',
      },
    },
  });

  await expect(moduleValue.getClientContextRegistry()).resolves.toEqual({
    test: expectedRegistry.test,
  });
});
