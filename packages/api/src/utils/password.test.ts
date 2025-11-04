import { expect, test } from 'vitest';

import { hashPassword, verifyPassword } from './password.js';

test('smoke', async () => {
  const result = await hashPassword('123');

  const actual = await verifyPassword(result, '123');

  expect(actual).toEqual(true);
});
