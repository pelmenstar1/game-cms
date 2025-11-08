import path from 'node:path';

import { env } from '@game-cms/env';
import { type MimeType, sendFile } from '@game-cms/shared';
import { apiRoute } from '@game-cms/shared-api';
import z from 'zod';

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
    if (staticConfig === undefined) {
      res.callNotFound();
      return;
    }

    const {
      baseDirectory,
      renderManifest: { cssBundles, jsDependencies, jsBundle },
    } = staticConfig;

    const [, filePath] = req.url.split('assets/', 2);

    if (filePath === 'renderer.js') {
      await sendFile(
        res,
        path.join(baseDirectory, jsBundle),
        'text/javascript'
      );
    } else if (
      jsDependencies.includes(filePath) ||
      cssBundles.includes(filePath)
    ) {
      const mime: MimeType = filePath.endsWith('.css')
        ? 'text/css'
        : 'text/javascript';

      await sendFile(res, path.join(baseDirectory, filePath), mime);
    } else {
      res.callNotFound();
      return;
    }
  },
});
