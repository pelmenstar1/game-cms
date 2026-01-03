import { signInPayload } from '@game-cms/base-types/schema';
import { apiRoute } from '@game-cms/core';
import { cms } from '@game-cms/global';

import {
  createRefreshAuthCookie,
  createSessionAuthCookie,
} from '../../../utils/authCookie.js';

export default apiRoute({
  url: '/auth/user/signin',
  method: 'POST',
  schema: {
    body: signInPayload,
  },
  handler: async (req, res) => {
    const payload = req.body;

    const { session, refresh } = await cms()
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
