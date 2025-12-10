import { signInPayload } from '@game-cms/base-types';
import { apiRoute } from '@game-cms/utils';

import {
  createRefreshAuthCookie,
  createSessionAuthCookie,
} from '../../../utils/cookie.js';

export default apiRoute({
  url: '/auth/user/signin',
  method: 'POST',
  schema: {
    body: signInPayload,
  },
  handler: async (req, res) => {
    const payload = req.body;

    const { session, refresh } = await cms
      .service('base::auth')
      .signUserIn(payload);

    res.status(200).headers({
      'set-cookie': [
        createSessionAuthCookie(session),
        createRefreshAuthCookie(refresh),
      ],
    });
  },
});
