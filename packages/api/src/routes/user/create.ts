import { createUserPayload } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

import { authHandler } from '../../middlewares/auth.js';

export default apiRoute({
  url: '/user',
  method: 'POST',
  schema: {
    body: createUserPayload,
  },
  config: {
    id: 'user$create',
  },
  preHandler: [authHandler()],
  handler: async (req, res) => {
    const payload = req.body;

    const { id } = await cms.service('base::user').create(payload);

    res.status(201).send({ id });
  },
});
