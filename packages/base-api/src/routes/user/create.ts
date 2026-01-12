import { createUserPayload } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/user',
  method: 'POST',
  schema: {
    body: createUserPayload,
  },
  config: {
    id: 'user$create',
  },
  handler: async (req, res) => {
    const payload = req.body;

    const { id } = await cms().service('base::user').create(payload);

    res.status(201).send({ id });
  },
});
