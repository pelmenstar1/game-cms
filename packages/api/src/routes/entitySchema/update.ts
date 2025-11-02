import { omit } from '@game-cms/shared/object';
import z from 'zod';

import { apiRoute } from '../../utils.js';
import { entitySchemaWithComponentValidation } from '../../utils/entitySchema.js';

export default apiRoute({
  path: '/entitySchema/:id',
  method: 'PUT',
  validation: {
    body: z.object({
      ...omit(entitySchemaWithComponentValidation.shape, 'id'),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;

    const updated = await cms
      .service('base::entitySchema')
      .update({ ...req.body, id });

    res.status(updated ? 200 : 404).end();
  },
});
