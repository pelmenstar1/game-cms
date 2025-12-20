import { pipeline } from 'node:stream/promises';

import send from '@fastify/send';
import { ApiError } from '@game-cms/base-utils';
import { SHARED_ASSET_PREFIX } from '@game-cms/build';
import { env } from '@game-cms/global';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: `/assets/${SHARED_ASSET_PREFIX}/:scope/:name.js`,
  method: 'GET',
  config: {
    exact: true,
  },
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

    if (filePath !== undefined) {
      const { type, headers, statusCode, stream } = await send(
        req.raw,
        filePath,
        {
          contentType: false,
        }
      );

      if (type === 'file') {
        res.raw.writeHead(statusCode, {
          ...headers,
          'content-type': 'text/javascript',
        });

        await pipeline(stream, res.raw);
      }
    }

    throw new ApiError('File not found', 'base::entity/notFound');
  },
});
