import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  path: '/entitySchema/list',
  method: 'GET',
  handler: (_req, res) => {
    const schemas = cms.service('base::entitySchema').getClientAll();

    res.json(schemas).end();
  },
});
