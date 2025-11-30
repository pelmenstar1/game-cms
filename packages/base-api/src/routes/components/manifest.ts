import { ApiError, ApiErrorCode, apiRoute } from '@game-cms/utils';
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

    const manifest = cms.service('base::component').getClientRenderManifest(id);
    if (!manifest) {
      throw new ApiError('Unknown component', ApiErrorCode.ENTITY_NOT_FOUND);
    }

    return manifest;
  },
});
