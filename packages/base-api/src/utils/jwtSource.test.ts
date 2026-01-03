import {
  makeRequest,
  type MakeRequestInjectOptions,
} from '@game-cms/testing-lib';
import { describe, expect, test } from 'vitest';

import { SESSION_JWT_COOKIE_NAME } from './authCookie.js';
import { getRequestJwt, type JwtSourceOptions } from './jwtSource.js';

const sourceOptions: JwtSourceOptions = {
  cookieName: SESSION_JWT_COOKIE_NAME,
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
    const expectedJwt = 'token';

    const actual = await getRequestJwtViaFastify({
      headers: {
        cookie: `${SESSION_JWT_COOKIE_NAME}=${expectedJwt}; smth=123`,
      },
    });

    expect(actual).toEqual(expectedJwt);
  });
});
