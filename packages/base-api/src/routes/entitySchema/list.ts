import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/entitySchema/list',
  method: 'GET',
  config: {
    id: 'entitySchema$get',
  },
  handler: () => {
    const schemas = cms().service('base::entitySchema').getAll();

    return schemas;
  },
});
