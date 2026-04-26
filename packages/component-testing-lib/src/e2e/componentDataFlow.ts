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
  ComponentStorageDataById,
  ForeignComponentClientDataTransformerContext,
} from '@game-cms/core';
import { beforeAll, describe, expect, test } from '@game-cms/e2e';
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
  const { foreignDefaultContext } = cms().service('base::component');

  const clientContext: ForeignComponentClientDataTransformerContext = {
    idSource: incrementingIdSource,
    sharedContext: {},
    validation: {
      validate: (id, data, options, params) => {
        const validator = clientComponents[id]?.validator;

        if (validator) {
          return validator(data, options, clientContext.validation, params);
        }
      },
    },
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

export function componentDataFlowTests<Id extends ComponentId>(
  id: Id,
  input: MaybeFactory<TestInput<Id>>
) {
  async function outDataToStorage<Args>(
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

  // out -> client -> out in -> storage -> out
  async function outToOutFlow<Args>(
    out: ComponentOutDataById<Id, Args>,
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

    const client = clientContext.toClient(id, out, clientOptions);
    const inData = clientContext.fromClient(id, client, clientOptions);

    const storage = await foreignStorageResolverContext.toStorage(
      id,
      inData,
      options
    );

    const actualOut = await foreignStorageResolverContext.fromStorage(
      id,
      storage,
      options
    );

    expect(actualOut).toEqual(out);
  }

  async function storageToStorageFlow<Args>(
    storage: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    clientContext: ForeignComponentClientDataTransformerContext
  ) {
    const { foreignStorageResolverContext } = cms().service('base::component');

    const out = await foreignStorageResolverContext.fromStorage(
      id,
      storage,
      options
    );

    return outToOutFlow(out, options, clientContext);
  }

  describe(`${id} data flow`, () => {
    let clientContext: ForeignComponentClientDataTransformerContext;

    beforeAll(async () => {
      clientContext = await clientResolverContext();
    });

    test('out to out', async () => {
      const outArray = resolveMaybeFactory(input).out;

      for (const { data: out, component } of outArray) {
        const { options } = component;

        await outToOutFlow(out, options, clientContext);
      }
    });

    test('self migration', async () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignDataMigrationContext } = cms().service('base::component');

      for (const { data: out, component } of outArray) {
        const { options } = component;

        const storage = await outDataToStorage(out, options, clientContext);
        const migratedResult = foreignDataMigrationContext.migrate(
          id,
          storage,
          options
        );

        expect(migratedResult).toEqual(storage);
      }
    });

    test('default out data', async () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignDefaultContext } = cms().service('base::component');

      for (const { component } of outArray) {
        const { options } = component;
        const data = foreignDefaultContext.getDefaultData(id, options);

        await outToOutFlow(data, options, clientContext);
      }
    });

    test('default storage data', async () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignStorageResolverContext } =
        cms().service('base::component');

      for (const { component } of outArray) {
        const { options } = component;

        const storage = await foreignStorageResolverContext.getDefaultData(
          id,
          options
        );

        await storageToStorageFlow(storage, options, clientContext);
      }
    });

    test('search', async () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignDataSearchContext } = cms().service('base::component');

      for (const { data: out, component } of outArray) {
        const { options } = component;

        const storage = await outDataToStorage(out, options, clientContext);
        const searchIndex = await foreignDataSearchContext.createSearchIndex(
          id,
          storage,
          options
        );

        const score = foreignDataSearchContext.getScore(
          '123',
          id,
          { storage, searchIndex },
          options
        );

        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });

    test('atomWalker', async () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignAtomWalkerContext } = cms().service('base::component');

      for (const { data: out, component } of outArray) {
        const { options } = component;

        const storage = await outDataToStorage(out, options, clientContext);

        foreignAtomWalkerContext.applyEach(
          id,
          storage,
          options,
          (atomData, atomOptions) => {
            expect(atomData).toBeDefined();
            expect(atomOptions).toBeDefined();
          }
        );
      }
    });

    test('structure', () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignDataStructureContext } = cms().service('base::component');

      for (const { component } of outArray) {
        const { options } = component;

        const structure = foreignDataStructureContext.getStructure(id, options);

        expect(structure).toBeDefined();
      }
    });

    test('innerDependencies', () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignDependencySourceContext } =
        cms().service('base::component');

      for (const { component } of outArray) {
        const { options } = component;

        const result = foreignDependencySourceContext.getDependencies(
          id,
          options
        );

        expect(result).toBeDefined();
      }
    });

    test('validator', async () => {
      const outArray = resolveMaybeFactory(input).out;

      const {
        foreignValidationContext,
        foreignClientOptionsTransformerContext,
      } = cms().service('base::component');

      for (const { data: out, component } of outArray) {
        const { options } = component;

        const clientOptions = foreignClientOptionsTransformerContext.toClient(
          id,
          options
        );

        const client = clientContext.toClient(id, out, clientOptions);
        const inData = clientContext.fromClient(id, client, clientOptions);

        const validationResult = await foreignValidationContext.validate(
          id,
          inData,
          options
        );

        expect(validationResult).toBeUndefined();
      }
    });

    test('client validator', () => {
      const outArray = resolveMaybeFactory(input).out;

      const { foreignClientOptionsTransformerContext } =
        cms().service('base::component');

      for (const { data: out, component } of outArray) {
        const { options } = component;

        const clientOptions = foreignClientOptionsTransformerContext.toClient(
          id,
          options
        );

        const client = clientContext.toClient(id, out, clientOptions);

        const validationResult = clientContext.validation.validate(
          id,
          client,
          clientOptions
        );

        expect(validationResult).toBeUndefined();
      }
    });
  });
}
