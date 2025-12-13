import { ApiError } from '@game-cms/base-utils';
import { env } from '@game-cms/global';
import type {
  ComponentClientRenderManifest,
  ComponentId,
} from '@game-cms/types';
import { service } from '@game-cms/utils';

function assetsPath(id: ComponentId, filePath: string) {
  return `/api/_components/${id}/assets/${filePath}`;
}

const RENDERER_FILE = 'renderer.js';

export default service({
  id: 'base::component',
  RENDERER_FILE,
  getController: <T extends ComponentId>(id: T) => {
    const staticConfig = env().components[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig === undefined) {
      throw new ApiError(`Unknown component: ${id}`, 'base::entity/notFound');
    }

    return staticConfig.controller;
  },
  getClientRenderManifest: (
    id: ComponentId
  ): ComponentClientRenderManifest | null => {
    const staticConfig = env().components[id];

    console.log(env().components);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig === undefined) {
      return null;
    }

    const { renderManifest } = staticConfig;

    return {
      main: assetsPath(id, RENDERER_FILE),
      dependencies: {
        css: Object.keys(renderManifest.dependencies.css).map((filePath) =>
          assetsPath(id, filePath)
        ),
      },
    };
  },
});
