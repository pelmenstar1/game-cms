import { apiRoute } from '@game-cms/shared-api';
import z from 'zod';

export default apiRoute({
  url: '/entitySchema/byId/:id',
  method: 'GET',
  config: {
    id: 'entitySchema$get',
  },
  schema: {
    params: z.object({
      id: z.string(),
    }),
  },
  handler: (req, res) => {
    const { id } = req.params;
    const result = cms.service('base::entitySchema').getClientById(id);

    if (result === null) {
      res.callNotFound();

      return;
    }

    return result;
  },
});
