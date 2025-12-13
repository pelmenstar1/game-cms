import { cms, env } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import type { ComponentRenderManifest } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

function getFileAndType(filePath: string, manifest: ComponentRenderManifest) {
  const { RENDERER_FILE } = cms().service('base::component');

  if (filePath === RENDERER_FILE) {
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
  url: '/_components/:id/assets/*',
  method: 'GET',
  schema: {
    params: z.object({
      id: z.string(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;

    const staticConfig = env().components[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig !== undefined) {
      const { renderManifest } = staticConfig;

      const { pathname } = new URL(req.url, 'http://a.com');
      const [, filePath] = pathname.split('assets/', 2);

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
