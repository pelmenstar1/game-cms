import { ApiError } from '@game-cms/base-utils';
import { env } from '@game-cms/global';
import type {
  ComponentClientManifest,
  ComponentDataValidatorById,
  ComponentId,
  ForeignComponentContext,
} from '@game-cms/types';
import { service } from '@game-cms/utils';

function assetsPath(id: ComponentId, filePath: string) {
  return `/api/components/${id}/assets/${filePath}`;
}

function getController<T extends ComponentId>(id: T) {
  const staticConfig = env().components[id];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (staticConfig === undefined) {
    throw new ApiError(`Unknown component: ${id}`, 'base::entity/notFound');
  }

  return staticConfig.controller;
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
      data: (id) => getController(id).default.data(),
    },
  }),
  getClientRenderManifest: <Id extends ComponentId>(
    id: Id
  ): ComponentClientManifest<Id> | null => {
    const { renderManifest } = env().components[id];
    const controller = getController(id);

    return {
      defaultData: controller.default.data(),
      source: {
        main: assetsPath(id, CLIENT_BUNDLE_FILE),
        dependencies: {
          css: Object.keys(renderManifest.dependencies.css).map((filePath) =>
            assetsPath(id, filePath)
          ),
        },
      },
    };
  },
});
