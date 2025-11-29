import path from 'node:path';

import { env } from '@game-cms/env';
import { sendFile } from '@game-cms/shared';
import type { ComponentRenderManifest } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

function getFileAndType(filePath: string, manifest: ComponentRenderManifest) {
  const { RENDERER_FILE } = cms.service('base::component');

  if (filePath === RENDERER_FILE) {
    return { filePath: manifest.jsBundle, mime: 'text/javascript' };
  } else if (manifest.jsDependencies.includes(filePath)) {
    return { filePath, mime: 'text/javascript' };
  } else if (manifest.cssBundles.includes(filePath)) {
    return { filePath, mime: 'text/css' };
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
      const { baseDirectory, renderManifest } = staticConfig;

      const { pathname } = new URL(req.url, 'http://a.com');
      const [, filePath] = pathname.split('assets/', 2);

      const fileAndType = getFileAndType(filePath, renderManifest);

      if (fileAndType) {
        await sendFile(
          res,
          path.join(baseDirectory, fileAndType.filePath),
          fileAndType.mime
        );

        return;
      }
    }

    res.callNotFound();
  },
});
