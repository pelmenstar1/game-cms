import { cms, env } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import type { ComponentRenderManifest } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

function getFilePath(url: string) {
  const result = url.match(/^\/api\/components\/(?:.*?)\/assets\/([^?]+)\??/);

  return result?.[1];
}

function getFileAndType(filePath: string, manifest: ComponentRenderManifest) {
  const { CLIENT_BUNDLE_FILE } = cms().service('base::component');

  if (filePath === CLIENT_BUNDLE_FILE) {
    return { source: manifest.main, mime: 'text/javascript' };
  }

  const jsSource = manifest.dependencies.js[filePath];

  if (jsSource) {
    return { source: jsSource, mime: 'text/javascript' };
  }

  const cssSource = manifest.dependencies.css[filePath];

  if (cssSource) {
    return { source: cssSource, mime: 'text/css' };
  }
}

export default apiRoute({
  url: '/components/:id/assets/*',
  method: 'GET',
  schema: {
    params: z.object({
      id: z.string(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;
    const filePath = getFilePath(req.url);

    const staticConfig = env().components[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig !== undefined && filePath) {
      const { renderManifest } = staticConfig;

      const fileAndType = getFileAndType(filePath, renderManifest);

      if (fileAndType) {
        const content = await resolveAsyncMaybeFactory(fileAndType.source);

        res.type(fileAndType.mime).send(content);

        return;
      }
    }

    res.callNotFound();
  },
});
