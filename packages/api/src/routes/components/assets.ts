import { env } from '@game-cms/env';
import { apiRoute } from '../../utils.js';
import path from 'node:path';

export default apiRoute({
  path: '/_components/:id/assets/{*splat}',
  method: 'GET',
  handler: (req, res, next) => {
    const { id, splat } = req.params as { id: string; splat: string[] };
    const staticConfig = env().components[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (staticConfig === undefined) {
      res.status(404);
    } else {
      const {
        baseDirectory,
        renderManifest: { cssBundles, jsDependencies, jsBundle },
      } = staticConfig;

      const filePath = splat.join('/');

      if (filePath === 'renderer.js') {
        res.sendFile(path.join(baseDirectory, jsBundle));
      } else if (
        jsDependencies.includes(filePath) ||
        cssBundles.includes(filePath)
      ) {
        res.sendFile(path.join(baseDirectory, filePath));
      } else {
        next();
        return;
      }
    }
  },
});
