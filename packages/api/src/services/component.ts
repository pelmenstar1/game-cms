import { env } from '@game-cms/env';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import type { ComponentId, ComponentRenderManifest } from '@game-cms/types';
import { service } from '@game-cms/utils';

function assetsPath(id: ComponentId, filePath: string) {
  return `/api/_components/${id}/assets/${filePath}`;
}

export default service({
  id: 'base::component',
  getController: <T extends ComponentId>(id: T) => {
    const staticConfig = env().components[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig === undefined) {
      throw new ApiError(
        `Unknown component: ${id}`,
        ApiErrorCode.ENTITY_NOT_FOUND
      );
    }

    return staticConfig.controller;
  },
  getClientRenderManifest: (
    id: ComponentId
  ): ComponentRenderManifest | null => {
    const staticConfig = env().components[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig === undefined) {
      return null;
    }

    const { renderManifest } = staticConfig;

    return {
      jsBundle: assetsPath(id, 'renderer.js'),
      jsDependencies: renderManifest.jsDependencies.map((filePath) =>
        assetsPath(id, filePath)
      ),
      cssBundles: renderManifest.cssBundles.map((filePath) =>
        assetsPath(id, filePath)
      ),
    };
  },
});
