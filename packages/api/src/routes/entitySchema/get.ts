import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  path: '/entitySchema/:id',
  method: 'GET',
  handler: (req, res, next) => {
    const { id } = req.params;
    const result = cms.service('base::entitySchema').getClientById(id);

    if (result === null) {
      next();
    } else {
      res.json(result);
    }
  },
});
