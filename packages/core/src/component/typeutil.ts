import { AnyKeyInObject, BooleanOr, RequiredIf } from '@game-cms/shared';

import {
  ComponentId,
  ComponentIsContainerById,
  ComponentTypeMap,
} from './types.js';

type PropertyExists<
  Id extends ComponentId,
  Args,
  K extends PropertyKey,
> = AnyKeyInObject<ComponentTypeMap<Args>[Id], K>;

export type RequiredIfExists<
  T,
  Id extends ComponentId,
  K extends PropertyKey,
  Args = unknown,
> = RequiredIf<T, PropertyExists<Id, Args, K>>;

export type RequiredIfExistsOrContainer<
  T,
  Id extends ComponentId,
  K extends PropertyKey,
  Args = unknown,
> = RequiredIf<
  T,
  BooleanOr<PropertyExists<Id, Args, K>, ComponentIsContainerById<Id, Args>>
>;
