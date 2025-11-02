import { apiRoute } from '@game-cms/utils';

import { handleObjectId } from '../../../utils/objectId.js';

export default apiRoute({
  path: '/entity/:entityId/byId/:id',
  method: 'DELETE',
  handler: async (req, res) => {
    const { entityId, id } = req.params;

    const objectId = handleObjectId(id);

    await cms.service('base::entity').deleteById(entityId, objectId);

    res.end();
  },
});
