import { ApiRouteId } from '@game-cms/core/api';
import { expect, test } from '@game-cms/e2e';

import {
  getPublicPermissions,
  updatePublicPermissions,
} from '../../../requests/index.js';
import { describeApiFlow } from '../../apiFlow.js';

describeApiFlow('public permissions flow', (contextRef) => {
  test('get and update public permissions', async () => {
    const { context } = contextRef;

    const newPermissions: ApiRouteId[] = ['storage$list', 'user$get'];

    await updatePublicPermissions(context, {
      permissions: newPermissions,
    });

    const { permissions } = await getPublicPermissions(context);
    expect(new Set(permissions)).toEqual(new Set(newPermissions));
  });
});
