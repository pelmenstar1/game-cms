import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/_components/:id/manifest.json',
  method: 'GET',
  schema: {
    params: z.object({
      id: z.string(),
    }),
  },
  handler: (req) => {
    const { id } = req.params;

    return cms.service('base::component').getClientRenderManifest(id);
  },
});
