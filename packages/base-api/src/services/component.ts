import { ApiError } from '@game-cms/base-utils';
import { env } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';
import type {
  ComponentDataValidatorById,
  ComponentId,
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

const CLIENT_BUNDLE_FILE = 'main.js';

export default service({
  id: 'base::component',
  CLIENT_BUNDLE_FILE,
  getController,
  foreignComponentContext: (): ForeignComponentContext => ({
    validation: {
      data: <Id extends ComponentId>(id: Id) =>
        getController(id).validation.data as ComponentDataValidatorById<Id>,
    },
    default: {
      data: (id) => resolveMaybeFactory(getController(id).default.data),
    },
  }),
});
