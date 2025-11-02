import type { ConditionalValueInput } from '@game-cms/conditional';
import { apiRoute } from '@game-cms/utils';
import qs from 'qs';

import { handleObjectId } from '../../../utils/objectId.js';

export default apiRoute({
  path: '/entity/:entityId/byId/:id',
  method: 'GET',
  handler: async (req, res) => {
    const { entityId, id } = req.params;

    const objectId = handleObjectId(id);

    const { search } = new URL(req.url);
    const filter = qs.parse(search);

    const result = await cms
      .service('base::entity')
      .getById(entityId, objectId, filter as ConditionalValueInput);

    res.json(result).end();
  },
});
