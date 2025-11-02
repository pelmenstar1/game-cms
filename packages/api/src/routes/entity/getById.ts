import type { ConditionalValueInput } from '@game-cms/conditional';
import { ObjectId } from 'mongodb';
import qs from 'qs';

import { apiRoute } from '../../utils.js';

export default apiRoute({
  path: '/entity/:entityId/getById/:id',
  method: 'GET',
  handler: async (req, res) => {
    const { entityId, id } = req.params;
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      res.status(400).end();
      return;
    }

    const { search } = new URL(req.url);
    const filter = qs.parse(search);

    const result = await cms
      .service('base::entity')
      .getById(entityId, objectId, filter as ConditionalValueInput);

    res.json(result).end();
  },
});
