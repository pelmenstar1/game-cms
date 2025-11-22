import { apiRoute } from '@game-cms/shared-api';

export default apiRoute({
  url: '/entitySchema/list',
  method: 'GET',
  config: {
    id: 'entitySchema$get',
  },
  handler: () => {
    const schemas = cms.service('base::entitySchema').getClientAll();

    return schemas;
  },
});
