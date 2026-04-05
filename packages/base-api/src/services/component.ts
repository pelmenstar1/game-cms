import type {
  ComponentClientOptionsById,
  ComponentDataResolverArgs,
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentPartialInDataById,
  ComponentResolvedDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
  ForeignComponentAtomWalkerContext,
  ForeignComponentClientOptionsTransformerContext,
  ForeignComponentDataMergeContext,
  ForeignComponentDataMigrationContext,
  ForeignComponentDataResolverContext,
  ForeignComponentDataSearchContext,
  ForeignComponentDataStructureContext,
  ForeignComponentDefaultDataContext,
  ForeignComponentDependencySourceContext,
  ForeignComponentStorageDataResolverContext,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { env } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';

function getController<T extends ComponentId>(id: T) {
  const controller = env().components.controllers[id];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (controller === undefined) {
    throw new ApiError(`Unknown component: ${id}`, 'base::entity/notFound');
  }

  return controller;
}

const foreignDefaultContext: ForeignComponentDefaultDataContext = {
  getDefaultData: (id, options) =>
    getController(id).core.defaultOutData(options, foreignDefaultContext),
};

const foreignValidationContext: ForeignComponentValidationContext = {
  validate: (id, data, options) =>
    getController(id).validator(data, options, foreignValidationContext),
};

const foreignResolverContext: ForeignComponentDataResolverContext = {
  resolveOutData: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentOutDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    args: ComponentDataResolverArgs
  ) => {
    const { resolver } = getController(id);

    return resolver
      ? resolver(data, options, foreignResolverContext, args)
      : (data as ComponentResolvedDataById<Id, Args>);
  },
};

const foreignStorageResolverContext: ForeignComponentStorageDataResolverContext =
  {
    getDefaultData: <Id extends ComponentId, Args>(
      id: Id,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { core, storageTransformer } = getController(id);

      return storageTransformer
        ? storageTransformer.getDefaultData(
            options,
            foreignStorageResolverContext
          )
        : (core.defaultOutData(
            options,
            foreignDefaultContext
          ) as ComponentStorageDataById<Id, Args>);
    },
    fromStorage: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentStorageDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { storageTransformer } = getController(id);

      return storageTransformer
        ? storageTransformer.fromStorage(
            data,
            options,
            foreignStorageResolverContext
          )
        : (data as ComponentOutDataById<Id, Args>);
    },
    toStorage: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentInDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { storageTransformer } = getController(id);

      return storageTransformer
        ? storageTransformer.toStorage(
            data,
            options,
            foreignStorageResolverContext
          )
        : (data as ComponentStorageDataById<Id, Args>);
    },
    applyAtPath: (id, data, options, path, apply) => {
      const { pathWalker } = getController(id).core;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (pathWalker) {
        pathWalker(data, options, path, apply, foreignStorageResolverContext);
      } else {
        apply(data, id, options);
      }
    },
    disposeData: async (id, data, options, params) => {
      const { storageTransformer } = getController(id);
      const disposeData = storageTransformer?.disposeData;

      if (disposeData) {
        await disposeData(data, options, foreignStorageResolverContext, {
          afterUpdate: params?.afterUpdate ?? false,
        });
      }
    },
  };

const foreignDataMigrationContext: ForeignComponentDataMigrationContext = {
  migrate: (id, data, options) => {
    const { migrate } = getController(id);

    const result = migrate?.(data, options, foreignDataMigrationContext);

    if (result !== undefined) {
      return result;
    }

    return foreignStorageResolverContext.getDefaultData(id, options);
  },
};

const foreignDataStructureContext: ForeignComponentDataStructureContext = {
  getStructure: (id, options) => {
    const { structure } = getController(id);
    if (structure === undefined) {
      return id;
    }

    return resolveMaybeFactory(structure, options, foreignDataStructureContext);
  },
};

const foreignAtomWalkerContext: ForeignComponentAtomWalkerContext = {
  walk: (id, data, options, apply) => {
    const { atomWalker } = getController(id);

    if (atomWalker) {
      atomWalker(data, options, apply, foreignAtomWalkerContext);
    } else {
      apply(id, data, options);
    }
  },
};

function toStoragePartial<Id extends ComponentId, Args>(
  id: Id,
  data: ComponentPartialInDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>
) {
  if (foreignValidationContext.validate(id, data, options) === undefined) {
    return foreignStorageResolverContext.toStorage(
      id,
      data as ComponentInDataById<Id, Args>,
      options
    );
  }

  throw new Error('Expected partial data to be full');
}

const foreignDataMergeContext: ForeignComponentDataMergeContext = {
  isMergeHandlerImplemented: (id) => {
    const { mergeData } = getController(id);

    return mergeData !== undefined;
  },
  merge: (id, target, source, options) => {
    const { mergeData } = getController(id);

    if (mergeData !== undefined) {
      return mergeData(target, source, options, foreignDataMergeContext);
    }

    return toStoragePartial(id, source, options);
  },
};

const foreignDataSearchContext: ForeignComponentDataSearchContext = {
  getScore: (query, id, target, options) => {
    const { search } = getController(id);

    return search
      ? search.getScore(query, target, options, foreignDataSearchContext)
      : 0;
  },
  createSearchIndex: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => {
    const { search } = getController(id);

    return search?.createIndex?.(
      data,
      options,
      foreignDataSearchContext
    ) as ComponentSearchIndexDataById<Id, Args>;
  },
};

const foreignClientOptionsTransformerContext: ForeignComponentClientOptionsTransformerContext =
  {
    toClient: <Id extends ComponentId, Args>(
      id: Id,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { clientOptionsTransformer } = getController(id);

      if (clientOptionsTransformer) {
        return clientOptionsTransformer.toClient(
          options,
          foreignClientOptionsTransformerContext
        );
      }

      return options as ComponentClientOptionsById<Id, Args>;
    },
  };

const foreignDependencySourceContext: ForeignComponentDependencySourceContext =
  {
    getDependencies: (id, options) => {
      const { innerDependencies } = getController(id);

      if (innerDependencies) {
        if (Array.isArray(innerDependencies)) {
          return innerDependencies;
        }

        return innerDependencies(options, foreignDependencySourceContext);
      }

      return [];
    },
  };

export default service({
  lifecycle: {},
  foreignDefaultContext,
  foreignValidationContext,
  foreignResolverContext,
  foreignStorageResolverContext,
  foreignDataMigrationContext,
  foreignDataStructureContext,
  foreignDataMergeContext,
  foreignDataSearchContext,
  foreignAtomWalkerContext,
  foreignClientOptionsTransformerContext,
  foreignDependencySourceContext,
  getController,
});
