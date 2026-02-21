import { expectTypeOf, test } from 'vitest';

import instance from '../../package.json' with { type: 'json' };
import type { PackageInfo } from './package.js';

test('PackageInfo', () => {
  expectTypeOf(instance).toExtend<PackageInfo>();
});
