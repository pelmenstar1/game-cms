import { apiRoute } from '../../utils.js';

export default apiRoute({
  path: '/_components/:id/manifest.json',
  method: 'GET',
  handler: (req, res) => {
    const { id } = req.params;
    const manifest = cms.service('base::component').getClientRenderManifest(id);

    if (manifest === null) {
      res.status(404);
    } else {
      res.status(200).write(JSON.stringify(manifest));
    }

    res.end();
  },
});
