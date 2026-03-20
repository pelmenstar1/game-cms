import fsp from 'node:fs/promises';
import path from 'node:path';

import type {
  ComponentClientDataById,
  ComponentClientDataTransformer,
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentSchema,
  ForeignComponentClientDataResolverContext,
} from '@game-cms/core';
import { getComponentIdFromCoreFile } from '@game-cms/core/node';
import { cms, env } from '@game-cms/global';
import {
  incrementingIdSource,
  type MaybeFactory,
  resolveMaybeFactory,
} from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { maybeImportFile, MODULE_NOT_FOUND_MARK } from '@game-cms/shared/node';
import { describe, expect, test } from 'vitest';

type TestInput<Id extends ComponentId> = {
  outs: { data: ComponentOutDataById<Id>; component: ComponentSchema<Id> }[];
};

async function gatherComponentClientChunk(dirPath: string) {
  const corePath = path.join(dirPath, 'core.js');
  const clientPath = path.join(dirPath, 'client.js');

  const clientModule = await maybeImportFile<{
    clientTransformer: ComponentClientDataTransformer;
  }>(clientPath);

  if (clientModule !== MODULE_NOT_FOUND_MARK) {
    const componentId = getComponentIdFromCoreFile(corePath);

    const { clientTransformer } = clientModule;

    return [componentId, clientTransformer] as const;
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
        ) ?? { result: clientData as ComponentInDataById<Id, Args> }
      );
    },
    toClient: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentOutDataById<Id, Args>,
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
    test('out -> client -> out in -> storage -> out', async () => {
      const clientContext = await clientResolverContext();
      const foreignStorageResolverContext = cms()
        .service('base::component')
        .createForeignStorageResolverContext({});

      for (const { data: out, component } of resolveMaybeFactory(input).outs) {
        const { options } = component;

        const client = clientContext.toClient(id, out, options);
        const { result: outIn, error: outInError } = clientContext.fromClient(
          id,
          client,
          options
        );

        if (outIn === undefined) {
          expect.fail(`fromClient failed: ${outInError}`);
        }

        const storage = await foreignStorageResolverContext.toStorage(
          id,
          outIn,
          options
        );

        const actualOut = await foreignStorageResolverContext.fromStorage(
          id,
          storage,
          options
        );

        expect(actualOut).toEqual(out);
      }
    });
  });
}
