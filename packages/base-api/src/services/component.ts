import type {
  ComponentDataResolverArgs,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentRawInPartialDataById,
  ComponentResolvedDataById,
  ComponentStorageDataById,
  ForeignComponentDataMergeContext,
  ForeignComponentDataMigrationContext,
  ForeignComponentDataResolverContext,
  ForeignComponentDataStructureContext,
  ForeignComponentDefaultRawDataContext,
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

const foreignDefaultContext: ForeignComponentDefaultRawDataContext = {
  getDefaultData: (id, options) =>
    getController(id).core.defaultRawData(options, foreignDefaultContext),
};

const foreignValidationContext: ForeignComponentValidationContext = {
  validate: (id, data, options) =>
    getController(id).core.validator(data, options, foreignValidationContext),
};

const foreignResolverContext: ForeignComponentDataResolverContext = {
  resolveRawData: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
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
        : (core.defaultRawData(
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
        : (data as ComponentRawDataById<Id, Args>);
    },
    toStorage: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentRawInDataById<Id, Args>,
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
        apply(data);
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

function toStoragePartial<Id extends ComponentId, Args>(
  id: Id,
  data: ComponentRawInPartialDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>
) {
  if (foreignValidationContext.validate(id, data, options) === undefined) {
    return foreignStorageResolverContext.toStorage(
      id,
      data as ComponentRawInDataById<Id, Args>,
      options
    );
  }

  throw new Error('Expected partial data to be full');
}

const foreignDataMergeContext: ForeignComponentDataMergeContext = {
  merge: (id, target, source, options) => {
    const { mergeData } = getController(id);

    if (mergeData !== undefined) {
      return mergeData(target, source, options, foreignDataMergeContext);
    }

    return toStoragePartial(id, source, options);
  },
};

export default service({
  id: 'base::component',
  foreignDefaultContext,
  foreignValidationContext,
  foreignResolverContext,
  foreignStorageResolverContext,
  foreignDataMigrationContext,
  foreignDataStructureContext,
  foreignDataMergeContext,
  getController,
});
