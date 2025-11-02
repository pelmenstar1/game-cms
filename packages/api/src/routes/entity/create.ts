import { apiRoute } from '@game-cms/utils';

import { getEntityValidationType } from '../../utils/entity.js';

export default apiRoute({
  path: '/entity/:entityId',
  method: 'POST',
  validation: {
    body: (req) => getEntityValidationType(req.params.entityId),
  },
  handler: async (req, res) => {
    const data = req.body;

    const result = await cms
      .service('base::entity')
      .create(req.params.entityId, data);

    res.status(201).json(result);
  },
});
