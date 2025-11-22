import {
  makeRequest,
  type MakeRequestInjectOptions,
} from '@game-cms/api-testing';
import { describe, expect, test } from 'vitest';

import authService from '../services/auth.js';
import { getRequestJwt, type JwtSourceOptions } from './jwtSource.js';

const sourceOptions: JwtSourceOptions = {
  cookieName: authService.SESSION_JWT_TOKEN_COOKIE_NAME,
};

function getRequestJwtViaFastify(options: MakeRequestInjectOptions) {
  return makeRequest({
    inject: options,
    factory: (req) => getRequestJwt(req, sourceOptions),
  });
}

describe('getRequestJwt', () => {
  test('no jwt', async () => {
    const actual = await getRequestJwtViaFastify({});

    expect(actual).toBeUndefined();
  });

  test('auth header', async () => {
    const expectedJwt = '123';
    const actual = await getRequestJwtViaFastify({
      headers: { authorization: `Bearer ${expectedJwt}` },
    });

    expect(actual).toEqual(expectedJwt);
  });

  test('cookie', async () => {
    const name = authService.SESSION_JWT_TOKEN_COOKIE_NAME;
    const expectedJwt = 'token';

    const actual = await getRequestJwtViaFastify({
      headers: {
        cookie: `${name}=${expectedJwt}; smth=123`,
      },
    });

    expect(actual).toEqual(expectedJwt);
  });
});
