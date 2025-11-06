import { signTokenInPayload } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: `/auth/token/jwt`,
  method: 'POST',
  schema: {
    body: signTokenInPayload,
  },
  handler: async (req) => {
    const { token } = req.body;

    const result = await cms.service('base::auth').signApiTokenIn(token);

    return result;
  },
});
