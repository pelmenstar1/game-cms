import { AnyKeyInObject, RequiredIf } from '@game-cms/shared';

import { ComponentId, ComponentTypeMap } from './types.js';

export type RequiredIfExists<
  T,
  Id extends ComponentId,
  K extends PropertyKey,
  Args = unknown,
> = RequiredIf<T, AnyKeyInObject<ComponentTypeMap<Args>[Id], K>>;
