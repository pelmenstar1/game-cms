import {
  AnyKeyInObject,
  FilePortal,
  IsAllOptional,
  PartialIf,
  RequiredIf,
} from '@game-cms/shared';

import { EntityCheckActionMap } from './action.js';
import { EntityCheckApiConfig } from './api.js';
import {
  EntityCheckDashboardConfig,
  EntityCheckGetClientDataFn,
} from './client.js';
import { EntityCheckExecuteFn } from './execute.js';
import { EntityCheckId, EntityCheckTypes } from './types.js';
import { EntityCheckWhenFn } from './when.js';

type BaseEntityCheck<Id extends string = string> = {
  id: Id;
  clientConfig?: FilePortal;
  dashboard?: EntityCheckDashboardConfig;
  api?: EntityCheckApiConfig;

  when?: EntityCheckWhenFn<Id>;
  execute: EntityCheckExecuteFn<Id>;
};

export type EntityCheck<Id extends string = string> = BaseEntityCheck<Id> &
  PartialIf<
    {
      actions: EntityCheckActionMap<Id>;
    },
    IsAllOptional<EntityCheckActionMap<Id>>
  > &
  RequiredIf<
    {
      getClientData?: EntityCheckGetClientDataFn<Id>;
    },
    AnyKeyInObject<EntityCheckTypes<Id>, 'clientData'>
  >;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEntityCheck = EntityCheck<any>;

export function defineEntityCheck<Id extends EntityCheckId>(
  value: EntityCheck<Id>
) {
  return value;
}
