import type { ApiRouteId } from '@game-cms/core/api';
import { expect, test } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

test('token flow', async () => {
  const service = cms().service('base::auth::apiToken');

  const name = 'Token 1';
  const permissions: ApiRouteId[] = ['storage$list'];

  const { id, token } = await service.create({
    name,
    permissions,
    expirationTime: 100,
  });

  const dbInfo = await service.getByToken(token);

  expect(dbInfo).toMatchObject({ name, permissions, _id: id });

  const dbInfo2 = await service.getById(id);

  expect(dbInfo2).toMatchObject({ name, permissions, _id: id });

  await service.deleteById(id);

  const dbInfo3 = await service.getById(id);

  expect(dbInfo3).toBeNull();
});
