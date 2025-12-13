import {
  getApiTokenJwtResponse,
  signTokenInPayload,
} from '@game-cms/base-types/schema';
import { cms } from '@game-cms/global';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: `/auth/token/jwt`,
  method: 'POST',
  schema: {
    body: signTokenInPayload,
    response: {
      200: getApiTokenJwtResponse,
    },
  },
  handler: async (req) => {
    const { token } = req.body;

    const result = await cms().service('base::auth').signApiTokenIn(token);

    return { jwt: result.token };
  },
});
