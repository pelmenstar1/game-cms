import { AnyKeyInObject, RequiredIf } from '@game-cms/shared';

import { ComponentNestedPathMap, ComponentPathWalker } from './pathWalker.js';
import {
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentOutDataById,
} from './types.js';

export type ForeignComponentDefaultDataContext = {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentOutDataById<Id, Args>;
};

export type ComponentDefaultDataHandler<Id extends ComponentId> = <Args>(
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDefaultDataContext
) => ComponentOutDataById<Id, Args>;

export type ComponentDataValidatorParams = {
  partial?: boolean;
};

export type ForeignComponentValidationContext = {
  validate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown,
    options: ComponentOptionsById<Id, Args>,
    params?: ComponentDataValidatorParams
  ) => ComponentErrorById<Id, Args> | undefined;
};

export type ComponentDataValidator<Id extends ComponentId> = <Args = unknown>(
  data: unknown,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext,
  params?: ComponentDataValidatorParams
) => ComponentErrorById<Id, Args> | undefined;

export type ComponentMeta = {
  ui?: {
    compact?: boolean;
  };
};

type BaseComponentCore<Id extends ComponentId = ComponentId> = {
  id: Id;
  meta?: ComponentMeta;
  defaultOutData: ComponentDefaultDataHandler<Id>;
  validator: ComponentDataValidator<Id>;
};

export type ComponentCore<Id extends ComponentId = ComponentId> =
  BaseComponentCore<Id> &
    RequiredIf<
      { pathWalker?: ComponentPathWalker<Id> },
      AnyKeyInObject<ComponentNestedPathMap<unknown>, Id>
    >;

/*@__NO_SIDE_EFFECTS__*/
export function defineComponentCore<Id extends string>(
  value: ComponentCore<Id>
) {
  return value;
}
