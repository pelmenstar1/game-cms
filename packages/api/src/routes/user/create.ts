import { createUserPayload } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/user',
  method: 'POST',
  schema: {
    body: createUserPayload,
  },
  handler: async (req, res) => {
    const payload = req.body;

    const { id } = await cms.service('base::user').create(payload);

    res.status(201).send({ id });
  },
});
