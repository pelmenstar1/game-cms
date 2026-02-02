import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type {
  ComponentClientDataById,
  ComponentClientDataTransformer,
  ComponentCore,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentSchema,
  ForeignComponentClientDataResolverContext,
} from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import {
  incrementingIdSource,
  type MaybeFactory,
  resolveMaybeFactory,
} from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { importFile } from '@game-cms/shared/io';
import { describe, expect, test } from 'vitest';

type TestInput<Id extends ComponentId> = {
  raws: { data: ComponentRawDataById<Id>; component: ComponentSchema<Id> }[];
};

async function gatherComponentClientChunk(dirPath: string) {
  const corePath = path.join(dirPath, 'core.js');
  const clientPath = path.join(dirPath, 'client.js');

  if (fs.existsSync(clientPath)) {
    const { default: core } = await importFile<{ default: ComponentCore }>(
      corePath
    );
    const { clientTransformer } = await importFile<{
      clientTransformer: ComponentClientDataTransformer;
    }>(clientPath);

    return [core.id, clientTransformer] as const;
  }
}

async function gatherComponentsForDistribution(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        return gatherComponentClientChunk(path.join(distPath, entry.name));
      }
    })
  );

  return filterOutNullable(result);
}

async function gatherComponents() {
  const { components } = env();

  const result = await Promise.all(
    components.distributions.map(({ directoryPath }) =>
      gatherComponentsForDistribution(directoryPath)
    )
  );

  return Object.fromEntries(result.flat()) as {
    [Id in ComponentId]?: ComponentClientDataTransformer<Id>;
  };
}

async function clientResolverContext() {
  const clientComponents = await gatherComponents();
  const { foreignValidationContext, foreignDefaultContext } =
    cms().service('base::component');

  const clientContext: ForeignComponentClientDataResolverContext = {
    idSource: incrementingIdSource,
    validation: foreignValidationContext,
    getDefaultData: (id, options) => {
      return (clientComponents[id]?.getDefaultData(options, clientContext) ??
        foreignDefaultContext.getDefaultData(id, options)) as never;
    },
    fromClient: <Id extends ComponentId, Args>(
      id: Id,
      clientData: ComponentClientDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => {
      return (
        clientComponents[id]?.fromClient(
          clientData,
          options,
          clientContext
        ) ?? { result: clientData as ComponentRawInDataById<Id, Args> }
      );
    },
    toClient: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentRawDataById<Id, Args>,
      options: ComponentOptionsById<Id>
    ) => {
      return (
        clientComponents[id]?.toClient(data, options, clientContext) ??
        (data as ComponentClientDataById<Id>)
      );
    },
  };

  return clientContext;
}

export function componentDataFlowTests<Id extends ComponentId>(
  id: Id,
  input: MaybeFactory<TestInput<Id>>
) {
  describe(`${id} data flow`, () => {
    test('raw -> client -> raw in -> storage -> raw', async () => {
      const clientContext = await clientResolverContext();
      const { foreignStorageResolverContext } =
        cms().service('base::component');

      for (const { data: raw, component } of resolveMaybeFactory(input).raws) {
        const { options } = component;

        const client = clientContext.toClient(id, raw, options);
        const { result: rawIn, error: rawInError } = clientContext.fromClient(
          id,
          client,
          options
        );

        if (rawIn === undefined) {
          expect.fail(`fromClient failed: ${rawInError}`);
        }

        const storage = await foreignStorageResolverContext.toStorage(
          id,
          rawIn,
          options
        );

        const actualRaw = await foreignStorageResolverContext.fromStorage(
          id,
          storage,
          options
        );

        expect(actualRaw).toEqual(raw);
      }
    });
  });
}
