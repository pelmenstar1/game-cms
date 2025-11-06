import { apiRoute } from '@game-cms/utils';

import { authHandler } from '../../middlewares/auth.js';

export default apiRoute({
  url: '/entitySchema/list',
  method: 'GET',
  config: {
    id: 'entitySchema$get',
  },
  preHandler: [authHandler()],
  handler: () => {
    const schemas = cms.service('base::entitySchema').getClientAll();

    return schemas;
  },
});
