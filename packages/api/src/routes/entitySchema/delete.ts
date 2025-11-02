import { apiRoute } from '../../utils.js';

export default apiRoute({
  path: '/entitySchema/:id',
  method: 'DELETE',
  handler: async (req, res) => {
    const { id } = req.params;

    await cms.service('base::entitySchema').deleteById(id);

    res.status(200).end();
  },
});
