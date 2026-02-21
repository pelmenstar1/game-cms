import { expectTypeOf, test } from 'vitest';

import instance from '../tsconfig.packages.json';
import { TsConfig } from './types';

test('TsConfig', () => {
  expectTypeOf(instance).toExtend<TsConfig>();
});
