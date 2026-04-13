import { FilePortal, GetPropertyOr, MaybePromise } from '@game-cms/shared';
import { ReactNode } from 'react';

import { CustomDashboardRoute } from '../../dashboard/routes.js';
import { EntityId, EntityVariant } from '../core.js';
import { EntityCheckId, EntityCheckTypes } from './types.js';
import { EntityCheckWhenParams } from './when.js';

export type EntityCheckClientData<Id extends EntityCheckId = EntityCheckId> =
  GetPropertyOr<EntityCheckTypes<Id>, 'clientData', unknown>;

export type EntityCheckClientDataMap = {
  [Id in EntityCheckId]: EntityCheckClientData<Id>;
};

export type EntityCheckRendererProps<Id extends EntityCheckId> = {
  className?: string;
  entityId: EntityId;
  documentId: string;
  data: EntityCheckClientData<Id>;
};

export type EntityCheckRenderer<Id extends EntityCheckId = EntityCheckId> = (
  props: EntityCheckRendererProps<Id>
) => ReactNode;

export type EntityCheckIsAllowedOptions<
  Id extends EntityCheckId = EntityCheckId,
> = {
  entityId: EntityId;
  documentId: string;
  documentVariant: EntityVariant;
  data: EntityCheckClientData<Id>;
};

export type EntityCheckClientController<
  Id extends EntityCheckId = EntityCheckId,
> = {
  isAllowed?: (options: EntityCheckIsAllowedOptions<Id>) => boolean;
  renderer?: () => Promise<{ default: EntityCheckRenderer<Id> }>;
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
