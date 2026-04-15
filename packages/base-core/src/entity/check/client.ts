import {
  AnyKeyInObject,
  FilePortal,
  GetPropertyOr,
  MaybePromise,
  RequiredIf,
} from '@game-cms/shared';
import { ReactNode } from 'react';

import { CustomDashboardRoute } from '../../dashboard/routes.js';
import { EntityId, EntityVariant } from '../core.js';
import { EntityCheckId, EntityCheckTypes } from './types.js';
import { EntityCheckWhenParams } from './when.js';

export type EntityCheckClientData<Id extends EntityCheckId = EntityCheckId> =
  GetPropertyOr<EntityCheckTypes<Id>, 'clientData', unknown>;

export type EntityCheckClientOptions<Id extends EntityCheckId = EntityCheckId> =
  GetPropertyOr<EntityCheckTypes<Id>, 'clientOptions', unknown>;

export type IsEntityCheckClientOptionsDefined<Id extends EntityCheckId> =
  AnyKeyInObject<EntityCheckTypes<Id>, 'clientOptions'>;

export type EntityCheckClientDataMap = {
  [Id in EntityCheckId]: EntityCheckClientData<Id>;
};

type BaseEntityCheckRendererProps<Id extends EntityCheckId> = {
  className?: string;
  entityId: EntityId;
  documentId: string;
  data: EntityCheckClientData<Id>;
  options: EntityCheckClientOptions<Id>;
};

type EntityCheckRendererProps<Id extends EntityCheckId> =
  BaseEntityCheckRendererProps<Id> &
    RequiredIf<
      {
        options?: EntityCheckClientOptions<Id>;
      },
      IsEntityCheckClientOptionsDefined<Id>
    >;

export type EntityCheckRenderer<Id extends EntityCheckId = EntityCheckId> = (
  props: EntityCheckRendererProps<Id>
) => ReactNode;

type BaseEntityCheckIsAllowedOptions<Id extends EntityCheckId = EntityCheckId> =
  {
    entityId: EntityId;
    documentId: string;
    documentVariant: EntityVariant;
    data: EntityCheckClientData<Id>;
  };

export type EntityCheckIsAllowedOptions<
  Id extends EntityCheckId = EntityCheckId,
> = BaseEntityCheckIsAllowedOptions<Id> &
  RequiredIf<
    {
      options?: EntityCheckClientOptions<Id>;
    },
    IsEntityCheckClientOptionsDefined<Id>
  >;

export type EntityCheckClientController<
  Id extends EntityCheckId = EntityCheckId,
> = {
  isAllowed?: (options: EntityCheckIsAllowedOptions<Id>) => boolean;
  renderer?: () => MaybePromise<{ default: EntityCheckRenderer<Id> }>;
};

export type EntityCheckGetClientDataParams<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> = EntityCheckWhenParams<Id, EId>;

export type EntityCheckGetClientDataFn<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> = (
  params: EntityCheckGetClientDataParams<Id, EId>
) => MaybePromise<EntityCheckClientData<Id>>;

export type EntityCheckDashboardConfig = {
  routes?: CustomDashboardRoute[];
  clientController?: FilePortal;
};

export function defineEntityCheckClientController<
  Id extends EntityCheckId = EntityCheckId,
>(controller: EntityCheckClientController<Id>) {
  return controller;
}
