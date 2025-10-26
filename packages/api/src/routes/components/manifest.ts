import { apiRoute } from '../../utils.js';

export default apiRoute({
  path: '/_components/:id/manifest.json',
  method: 'GET',
  handler: (req, res) => {
    const { id } = req.params;
    const manifest = cms.service('base::component').getClientRenderManifest(id);

    res.json(manifest);
    res.end();
  },
});
