import type { ApiRouteId } from '@game-cms/core/api';
import { expect, test } from 'vitest';

import { hydrateRouteId } from './routeId.js';

test.each<[ApiRouteId, unknown, string]>([
  ['123$action', null, '123$action'],
  ['123$action', {}, '123$action'],
  ['/123/[entity]$action[abc]', { entity: 'cat' }, '/123/cat$action[abc]'],
  [
    '/123/[entity]/[part2]$action[abc]',
    { entity: 'cat', part2: '321' },
    '/123/cat/321$action[abc]',
  ],
])('hydrateRouteId', (input, params, expected) => {
  const actual = hydrateRouteId(input, params);

  expect(actual).toEqual(expected);
});
