import { ApiError } from '@game-cms/base-utils';
import type {
  ComponentDataResolverArgs,
  ComponentId,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ComponentStorageDataById,
  ForeignComponentDataResolverContext,
  ForeignComponentDefaultDataContext,
  ForeignComponentStorageDataResolverContext,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { service } from '@game-cms/core';
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

const foreignValidationContext: ForeignComponentValidationContext = {
  validate: (id, data, options) =>
    getController(id).validator(data, options, foreignValidationContext),
};

const foreignDefaultContext: ForeignComponentDefaultDataContext = {
  getDefault: (id, options) => {
    const factory = getController(id).meta.defaultRawData;

    return resolveMaybeFactory(factory, options, foreignDefaultContext);
  },
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
      const { storageResolver } = getController(id);

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
      data: ComponentRawDataById<Id, Args>,
      options: ComponentOptionsById<Id, Args>
    ) => {
      const { storageResolver } = getController(id);

      return storageResolver
        ? storageResolver.toStorage(
            data,
            options,
            foreignStorageResolverContext
          )
        : (data as ComponentStorageDataById<Id, Args>);
    },
  };

export default service({
  id: 'base::component',
  foreignValidationContext,
  foreignDefaultContext,
  foreignResolverContext,
  foreignStorageResolverContext,
  getController,
});
