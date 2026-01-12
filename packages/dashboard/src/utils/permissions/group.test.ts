import type { ApiRouteId } from '@game-cms/core/api';
import { expect, test } from 'vitest';

import { groupPermissions, type PermissionGroupMap } from './group';

test.each<[ApiRouteId[], PermissionGroupMap]>([
  [['ns$action'], { ns: { actions: ['action'], children: {} } }],
  [
    ['ns/ns2$action', 'ns$action2'],
    {
      ns: {
        actions: ['action2'],
        children: { ns2: { actions: ['action'], children: {} } },
      },
    },
  ],
])('groupPermissions', (input, expected) => {
  const actual = groupPermissions(input);

  expect(actual).toEqual(expected);
});
