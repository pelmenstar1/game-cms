import { apiRoute } from '../../utils.js';

export default apiRoute({
  path: '/entitySchema/:id',
  method: 'GET',
  handler: async (req, res) => {
    const { id } = req.params;
    const result = await cms.service('base::entitySchema').get(id);

    if (result === null) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  },
});
