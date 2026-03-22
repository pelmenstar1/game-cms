import { AnyKeyInObject, RequiredIf } from '@game-cms/shared';

import { ComponentNestedPathMap, ComponentPathWalker } from './pathWalker.js';
import {
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

type BaseComponentCore<Id extends ComponentId = ComponentId> = {
  id: Id;
  defaultOutData: ComponentDefaultDataHandler<Id>;
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
