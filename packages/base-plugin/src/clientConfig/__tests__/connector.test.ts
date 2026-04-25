/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { CmsEnvironment, setEnvironment } from '@game-cms/global';
import { createJiti } from 'jiti';
import { expect, test } from 'vitest';

import { emitClientConfigConnector } from '../connector.js';

const fixturesDir = path.join(import.meta.dirname, 'fixtures');

function fixturePath(name: string) {
  return path.join(fixturesDir, name);
}

function makeEnv(plugins: any[]): CmsEnvironment {
  return { config: { plugins } } as unknown as CmsEnvironment;
}

async function evalConnector(env: CmsEnvironment) {
  setEnvironment(env);

  const jiti = createJiti(import.meta.url);
  const sourceCode = await emitClientConfigConnector();

  return jiti.evalModule(sourceCode, {
    id: 'connector.js',
    filename: pathToFileURL('./connector.js').href,
  });
}

test('emitClientConfigConnector: no config portals, one resolver', async () => {
  const moduleValue: any = await evalConnector(
    makeEnv([
      {
        id: 'test',
        clientConfigResolver: { filePath: fixturePath('resolver.client.ts') },
      },
    ])
  );

  expect(moduleValue.default).toEqual({});
});

test('emitClientConfigConnector: one config portal, one resolver', async () => {
  const moduleValue: any = await evalConnector(
    makeEnv([
      {
        id: 'test',
        config: { client: { filePath: fixturePath('config1.client.ts') } },
        clientConfigResolver: { filePath: fixturePath('resolver.client.ts') },
      },
    ])
  );

  expect(moduleValue.default).toEqual({ x: 1 });
});

test('emitClientConfigConnector: two config portals, one resolver', async () => {
  const moduleValue: any = await evalConnector(
    makeEnv([
      {
        id: 'plugin1',
        config: { client: { filePath: fixturePath('config1.client.ts') } },
      },
      {
        id: 'plugin2',
        config: { client: { filePath: fixturePath('config2.client.ts') } },
        clientConfigResolver: { filePath: fixturePath('resolver.client.ts') },
      },
    ])
  );

  expect(moduleValue.default).toEqual({ x: 1, y: 2 });
});

test('emitClientConfigConnector: three config portals, one resolver', async () => {
  const moduleValue: any = await evalConnector(
    makeEnv([
      {
        id: 'plugin1',
        config: { client: { filePath: fixturePath('config1.client.ts') } },
      },
      {
        id: 'plugin2',
        config: { client: { filePath: fixturePath('config2.client.ts') } },
      },
      {
        id: 'plugin3',
        config: { client: { filePath: fixturePath('config3.client.ts') } },
        clientConfigResolver: { filePath: fixturePath('resolver.client.ts') },
      },
    ])
  );

  expect(moduleValue.default).toEqual({ x: 1, y: 2, z: 3 });
});
