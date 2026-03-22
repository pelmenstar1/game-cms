import { ComponentDataCustomValidator } from '@game-cms/core';

import { AnyEntityCheck } from './check.js';
import { AnyEntityHook } from './hook.js';

export type EntityConfig = {
  checks?: AnyEntityCheck[];
  hooks?: AnyEntityHook[];
  customValidators?: Record<string, ComponentDataCustomValidator>;
};

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    entity?: EntityConfig;
  }
}
