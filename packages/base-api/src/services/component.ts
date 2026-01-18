import { ApiError } from '@game-cms/base-core';
import type {
  ComponentDataResolverArgs,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentResolvedDataById,
  ComponentStorageDataById,
  ForeignComponentDataResolverContext,
  ForeignComponentDefaultDataContext,
  ForeignComponentStorageDataResolverContext,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { service } from '@game-cms/core';
import { env } from '@game-cms/global';

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
    fromStorage: <Id extends ComponentId, Args>(
      id: Id,
      data: ComponentStorageDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { storageTransformer: storageResolver } = getController(id);

      return storageResolver
        ? storageResolver.fromStorage(
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
      const { pathWalker } = getController(id);

      if (pathWalker) {
        pathWalker(data, options, path, apply, foreignStorageResolverContext);
      } else {
        apply(data);
      }
    },
  };

export default service({
  id: 'base::component',
  foreignDefaultContext,
  foreignValidationContext,
  foreignResolverContext,
  foreignStorageResolverContext,
  getController,
});
