import type {
  ComponentBackContext,
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
  ForeignComponentDataMergeContext,
  ForeignComponentDataMigrationContext,
  ForeignComponentDataResolverContext,
  ForeignComponentDataSearchContext,
  ForeignComponentDataStructureContext,
  ForeignComponentDefaultDataContext,
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
    getController(id).core.validator(data, options, foreignValidationContext),
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

function createForeignStorageResolverContext(
  backContext: ComponentBackContext
) {
  const context: ForeignComponentStorageDataResolverContext = {
    backContext,
    getDefaultData: <Id extends ComponentId, Args>(
      id: Id,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { core, storageTransformer } = getController(id);

      return storageTransformer
        ? storageTransformer.getDefaultData(options, context)
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
        ? storageTransformer.fromStorage(data, options, context)
        : (data as ComponentOutDataById<Id, Args>);
    },
    toStorage: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentInDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { storageTransformer } = getController(id);

      return storageTransformer
        ? storageTransformer.toStorage(data, options, context)
        : (data as ComponentStorageDataById<Id, Args>);
    },
    applyAtPath: (id, data, options, path, apply) => {
      const { pathWalker } = getController(id).core;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (pathWalker) {
        pathWalker(data, options, path, apply, context);
      } else {
        apply(data);
      }
    },
  };

  return context;
}

function createForeignDataMigrationContext(backContext: ComponentBackContext) {
  const storageResolverContext =
    createForeignStorageResolverContext(backContext);

  const context: ForeignComponentDataMigrationContext = {
    migrate: (id, data, options) => {
      const { migrate } = getController(id);

      const result = migrate?.(data, options, context);

      if (result !== undefined) {
        return result;
      }

      return storageResolverContext.getDefaultData(id, options);
    },
  };

  return context;
}

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

function createForeignDataMergeContext(backContext: ComponentBackContext) {
  const storageResolverContext =
    createForeignStorageResolverContext(backContext);

  function toStoragePartial<Id extends ComponentId, Args>(
    id: Id,
    data: ComponentPartialInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) {
    if (foreignValidationContext.validate(id, data, options) === undefined) {
      return storageResolverContext.toStorage(
        id,
        data as ComponentInDataById<Id, Args>,
        options
      );
    }

    throw new Error('Expected partial data to be full');
  }

  const context: ForeignComponentDataMergeContext = {
    merge: (id, target, source, options) => {
      const { mergeData } = getController(id);

      if (mergeData !== undefined) {
        return mergeData(target, source, options, context);
      }

      return toStoragePartial(id, source, options);
    },
  };

  return context;
}

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

export default service({
  id: 'base::component',
  foreignDefaultContext,
  foreignValidationContext,
  foreignResolverContext,
  createForeignStorageResolverContext,
  createForeignDataMigrationContext,
  foreignDataStructureContext,
  createForeignDataMergeContext,
  foreignDataSearchContext,
  foreignAtomWalkerContext,
  getController,
});
