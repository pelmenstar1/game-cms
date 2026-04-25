import { ApiRouteId } from '@game-cms/core/api';
import { expect, test } from '@game-cms/e2e';

import {
  createUser,
  deleteUserById,
  getUserById,
  listUsers,
  updateUserById,
} from '../../requests/index.js';
import { describeApiFlow } from '../apiFlow.js';

describeApiFlow('user flow', (contextRef) => {
  test('create, get, update, list, delete user', async () => {
    const { context } = contextRef;

    const displayName = 'Test User';
    const email = 'testuser@example.com';
    const password = 'password123';
    const permissions: ApiRouteId[] = ['storage$list'];

    const { id } = await createUser(context, {
      displayName,
      email,
      password,
      permissions,
    });

    expect(id).toBeDefined();

    const user = await getUserById(context, id);

    expect(user).toMatchObject({ displayName, email, permissions });

    const newDisplayName = 'Updated User';
    const newPermissions: ApiRouteId[] = ['user$get'];

    await updateUserById(context, id, {
      displayName: newDisplayName,
      permissions: newPermissions,
    });

    const updatedUser = await getUserById(context, id);

    expect(updatedUser).toMatchObject({
      displayName: newDisplayName,
      permissions: newPermissions,
    });

    const { items } = await listUsers(context, { size: 100 });

    expect(items.some((u) => u.id === id)).toBe(true);

    await deleteUserById(context, id);

    await expect(() => getUserById(context, id)).rejects.toBeDefined();
  });
});
