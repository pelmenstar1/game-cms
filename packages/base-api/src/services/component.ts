import { ApiError } from '@game-cms/base-utils';
import { env } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';
import type {
  ComponentDataById,
  ComponentDataResolverArgs,
  ComponentId,
  ComponentOptionsById,
  ComponentResolvedDataById,
  ForeignComponentContext,
} from '@game-cms/types';
import { service } from '@game-cms/utils';

function getController<T extends ComponentId>(id: T) {
  const controller = env().components[id];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (controller === undefined) {
    throw new ApiError(`Unknown component: ${id}`, 'base::entity/notFound');
  }

  return controller;
}

const foreignComponentContext: Omit<ForeignComponentContext, 'clientResolver'> =
  {
    validation: {
      data: (id, data, options) =>
        getController(id).validator(
          data,
          options,
          foreignComponentContext.validation
        ),
    },
    default: {
      data: (id, options) => {
        const factory = getController(id).meta.defaultData;

        return resolveMaybeFactory(
          factory,
          options,
          foreignComponentContext.default
        );
      },
    },
    resolver: {
      data: <Id extends ComponentId, Args>(
        id: Id,
        data: ComponentDataById<Id, Args>,
        options: ComponentOptionsById<Id, Args>,
        args: ComponentDataResolverArgs
      ) => {
        const { resolver } = getController(id);

        return resolver
          ? resolver(data, options, foreignComponentContext.resolver, args)
          : (data as ComponentResolvedDataById<Id, Args>);
      },
    },
  };

export default service({
  id: 'base::component',
  foreignComponentContext,
  getController,
});
