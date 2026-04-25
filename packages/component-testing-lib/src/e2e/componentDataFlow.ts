import fsp from 'node:fs/promises';
import path from 'node:path';

import type {
  ComponentClientController,
  ComponentClientDataById,
  ComponentClientOptionsById,
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentSchema,
  ForeignComponentClientDataTransformerContext,
} from '@game-cms/core';
import { describe, expect, test } from '@game-cms/e2e';
import { cms, env } from '@game-cms/global';
import {
  incrementingIdSource,
  type MaybeFactory,
  resolveMaybeFactory,
} from '@game-cms/shared';
import { importFile } from '@game-cms/shared/node';

type DataWithSchema<Id extends ComponentId, T> = {
  data: T;
  component: ComponentSchema<Id>;
};

type TestInput<Id extends ComponentId> = {
  out: DataWithSchema<Id, ComponentOutDataById<Id>>[];
};

async function gatherComponentClientChunk(dirPath: string) {
  const clientPath = path.join(dirPath, 'client.js');

  const clientModule = await importFile<{
    default: ComponentClientController;
  }>(clientPath);

  const controller = clientModule.default;

  return [controller.core.id, controller] as const;
}

async function gatherComponentsForDistribution(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        gatherComponentClientChunk(path.join(distPath, entry.name))
      )
  );
}

async function gatherComponents() {
  const { components } = env();

  const result = await Promise.all(
    components.distributions.map(({ directoryPath }) =>
      gatherComponentsForDistribution(directoryPath)
    )
  );

  return Object.fromEntries(result.flat()) as {
    [Id in ComponentId]?: ComponentClientController<Id>;
  };
}

async function clientResolverContext() {
  const clientComponents = await gatherComponents();
  const { foreignValidationContext, foreignDefaultContext } =
    cms().service('base::component');

  const clientContext: ForeignComponentClientDataTransformerContext = {
    idSource: incrementingIdSource,
    validation: foreignValidationContext,
    sharedContext: {},
    getDefaultData: (id, options) => {
      const defaultData = clientComponents[id]?.getDefaultData?.(
        options,
        clientContext
      );

      if (defaultData !== undefined) {
        return defaultData;
      }

      return foreignDefaultContext.getDefaultData(id, options) as never;
    },
    fromClient: <Id extends ComponentId, Args>(
      id: Id,
      clientData: ComponentClientDataById<Id, Args>,
      options: ComponentClientOptionsById<Id, Args>
    ) => {
      return (clientComponents[id]?.transformer?.fromClient(
        clientData,
        options,
        clientContext
      ) ?? clientData) as ComponentInDataById<Id, Args>;
    },
    toClient: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentOutDataById<Id, Args>,
      options: ComponentClientOptionsById<Id, Args>
    ) => {
      return (
        clientComponents[id]?.transformer?.toClient(
          data,
          options,
          clientContext
        ) ?? (data as ComponentClientDataById<Id, Args>)
      );
    },
  };

  return clientContext;
}

async function outDataToStorage<Id extends ComponentId, Args>(
  id: Id,
  outData: ComponentOutDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  clientContext: ForeignComponentClientDataTransformerContext
) {
  const {
    foreignStorageResolverContext,
    foreignClientOptionsTransformerContext,
  } = cms().service('base::component');

  const clientOptions = foreignClientOptionsTransformerContext.toClient(
    id,
    options
  );

  const client = clientContext.toClient(id, outData, clientOptions);
  const outIn = clientContext.fromClient(id, client, clientOptions);

  return foreignStorageResolverContext.toStorage(id, outIn, options);
}

export function componentDataFlowTests<Id extends ComponentId>(
  id: Id,
  input: MaybeFactory<TestInput<Id>>
) {
  describe(`${id} data flow`, () => {
    test('out -> client -> out in -> storage -> out', async () => {
      const clientContext = await clientResolverContext();
      const { foreignStorageResolverContext } =
        cms().service('base::component');

      for (const { data: out, component } of resolveMaybeFactory(input).out) {
        const { options } = component;

        const storage = await outDataToStorage(id, out, options, clientContext);
        const actualOut = await foreignStorageResolverContext.fromStorage(
          id,
          storage,
          options
        );

        expect(actualOut).toEqual(out);
      }
    });

    test('self migration', async () => {
      const outArray = resolveMaybeFactory(input).out;
      const clientContext = await clientResolverContext();

      const { foreignDataMigrationContext } = cms().service('base::component');

      for (const { data: out, component } of outArray) {
        const { options } = component;

        const storage = await outDataToStorage(id, out, options, clientContext);
        const migratedResult = foreignDataMigrationContext.migrate(
          id,
          storage,
          options
        );

        expect(migratedResult).toEqual(storage);
      }
    });
  });
}
