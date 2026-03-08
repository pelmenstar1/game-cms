import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { EntityCheckRenderer } from '@game-cms/base-core';
import { CmsEnvironment, setEnvironment } from '@game-cms/global';
import { DefaultExport } from '@game-cms/shared';
import { createJiti } from 'jiti';
import { expect, test } from 'vitest';

import { emitEntityCheckConnector } from '../connector.js';

function setupEntityCheckFixture() {
  const fixtureDir = path.join(import.meta.dirname, `fixtures`);

  const config = {
    config: {
      entity: {
        checks: [
          {
            id: 'test-check',
            dashboard: {
              entityAccessRenderer: {
                filePath: path.join(fixtureDir, 'testCheck.js'),
              },
            },
          },
          {
            id: 'check-without-renderer',
          },
        ],
      },
    },
  } as CmsEnvironment;

  setEnvironment(config);
  return config;
}

test('emitEntityCheckConnector', async () => {
  setupEntityCheckFixture();

  const jiti = createJiti(import.meta.url);
  const sourceCode = emitEntityCheckConnector();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moduleValue: any = jiti.evalModule(sourceCode, {
    id: 'entityCheck.js',
    filename: pathToFileURL('./entityCheck.js').href,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const rendererImport = moduleValue['test-check'] as () => Promise<
    DefaultExport<EntityCheckRenderer>
  >;

  const renderer = await rendererImport();

  expect(
    renderer.default({
      entityId: '',
      documentId: '',
      data: undefined,
    })
  ).toEqual('test-check');
  expect(moduleValue).not.toHaveProperty('check-without-renderer');
});
