import { env } from '@game-cms/env';
import { apiRoute } from '../../utils.js';
import { SHARED_ASSET_PREFIX } from '@game-cms/build';
import { isFileNotFoundError } from '@game-cms/shared/errors';

export default apiRoute({
  path: `/assets/${SHARED_ASSET_PREFIX}/:scope/:name.js`,
  method: 'GET',
  exact: true,
  handler: (req, res, next) => {
    const { scope, name } = req.params;

    const { paths } = env().sharedAssets;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const filePath = paths[scope]?.[name] as string | undefined;

    if (filePath === undefined) {
      next();
      return;
    }

    try {
      res.sendFile(filePath);
    } catch (error: unknown) {
      if (isFileNotFoundError(error)) {
        next();
        return;
      }

      throw error;
    }
  },
});
