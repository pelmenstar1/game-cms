import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/entitySchema/list',
  method: 'GET',
  handler: () => {
    const schemas = cms.service('base::entitySchema').getClientAll();

    return schemas;
  },
});
