import { cms, env } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/components/manifest',
  method: 'GET',
  handler: () => {
    const service = cms().service('base::component');

    const result = mapObject(env().components, (_, id) =>
      service.getClientRenderManifest(id)
    );

    return result;
  },
});
