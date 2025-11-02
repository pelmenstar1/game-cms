import { apiRoute } from '@game-cms/utils';

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
