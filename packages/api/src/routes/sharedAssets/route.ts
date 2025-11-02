import { SHARED_ASSET_PREFIX } from '@game-cms/build';
import { env } from '@game-cms/env';
import { sendFile } from '@game-cms/shared';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: `/assets/${SHARED_ASSET_PREFIX}/:scope/:name.js`,
  method: 'GET',
  exact: true,
  schema: {
    params: z.object({
      scope: z.string(),
      name: z.string(),
    }),
  },
  handler: async (req, res) => {
    const { scope, name } = req.params;

    const { paths } = env().sharedAssets;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const filePath = paths[scope]?.[name] as string | undefined;

    if (filePath === undefined) {
      res.callNotFound();
      return;
    }

    try {
      await sendFile(res, filePath, 'text/javascript');
    } catch (error: unknown) {
      if (isFileNotFoundError(error)) {
        res.callNotFound();
        return;
      }

      throw error;
    }
  },
});
