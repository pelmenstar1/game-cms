import type { ApiRoute } from '@game-cms/core/api';
import type {
  AnyKeyInObject,
  FilePortal,
  GetPropertyOr,
  IsAllOptional,
  MaybePromise,
  PartialIf,
  RequiredIf,
  RequiredProperty,
} from '@game-cms/shared';
import type { ObjectId } from 'mongodb';
import { ReactNode } from 'react';
import type z from 'zod';
import type { ZodType } from 'zod';

import { CustomDashboardRoute } from '../dashboard/routes.js';
import type { getEntityChecksResponse } from '../schema/entityCheck.js';
import type {
  BaseEntityStorageDataById,
  EntityId,
  EntityMeta,
} from './core.js';

export interface EntityCheckTypeMap {}

export type EntityCheckId = keyof EntityCheckTypeMap extends never
  ? string
  : keyof EntityCheckTypeMap;

type EntityCheckTypes<Id extends EntityCheckId> = GetPropertyOr<
  EntityCheckTypeMap,
  Id,
  unknown
>;

export type EntityCheckClientData<Id extends EntityCheckId = EntityCheckId> =
  GetPropertyOr<EntityCheckTypes<Id>, 'clientData', unknown>;

export type EntityCheckStorageData<Id extends EntityCheckId = EntityCheckId> =
  GetPropertyOr<EntityCheckTypes<Id>, 'storageData', unknown>;

export type EntityCheckStorageDataMap = {
  [Id in EntityCheckId]: EntityCheckStorageData<Id>;
};

export type EntityCheckClientDataMap = {
  [Id in EntityCheckId]: EntityCheckClientData<Id>;
};

export type EntityCheckActionTypes<Id extends EntityCheckId> = GetPropertyOr<
  EntityCheckTypes<Id>,
  'actions',
  Record<string, never>
>;

export type EntityCheckActionIds<Id extends EntityCheckId> =
  keyof EntityCheckActionTypes<Id> & string;

export type EntityCheckActionPayload<
  Id extends EntityCheckId,
  K extends EntityCheckActionIds<Id>,
> = GetPropertyOr<
  GetPropertyOr<EntityCheckActionTypes<Id>, K, null>,
  'payload',
  undefined
>;

export type EntityCheckWhenParams<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> = {
  entityId: EId;
  id?: ObjectId;
  entityMeta: EntityMeta;
  storageData?: EntityCheckStorageData<Id>;
};

export interface EntityCheckExecuteParams<
  Id extends EntityCheckId,
  EId extends EntityId = EntityId,
> extends EntityCheckWhenParams<Id, EId> {
  entityData: BaseEntityStorageDataById<EId>;
}

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

export interface EntityCheckExecuteActionParams<
  Id extends EntityCheckId,
  ActionType extends EntityCheckActionIds<Id>,
  EId extends EntityId = EntityId,
> extends RequiredProperty<EntityCheckWhenParams<Id, EId>, 'id'> {
  context: {
    actorId: ObjectId;
  };
  payload: EntityCheckActionPayload<Id, ActionType>;
}

export type EntityCheckExecuteActionFn<
  Id extends EntityCheckId,
  ActionType extends EntityCheckActionIds<Id>,
  EId extends EntityId = EntityId,
> = (
  params: EntityCheckExecuteActionParams<Id, ActionType, EId>
) => MaybePromise<EntityCheckStorageData<Id>>;

export type EntityCheckActionDescriptor<
  Id extends EntityCheckId,
  ActionType extends EntityCheckActionIds<Id>,
> = {
  execute: EntityCheckExecuteActionFn<Id, ActionType>;
} & PartialIf<
  {
    payloadSchema: ZodType<EntityCheckActionPayload<Id, ActionType>>;
  },
  EntityCheckActionPayload<Id, ActionType> extends undefined ? true : false
>;

export type EntityCheckActionMap<Id extends EntityCheckId> = {
  [ActionType in EntityCheckActionIds<Id>]: EntityCheckActionDescriptor<
    Id,
    ActionType
  >;
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

type BaseEntityCheck<Id extends string = string> = {
  id: Id;
  clientConfig?: FilePortal;
  when?: (params: EntityCheckWhenParams<Id>) => MaybePromise<boolean>;
  execute: <EId extends EntityId>(
    value: EntityCheckExecuteParams<Id, EId>
  ) => MaybePromise<void>;
  dashboard?: {
    routes?: CustomDashboardRoute[];
    entityAccessRenderer?: FilePortal;
  };
  api?: {
    routes?: ApiRoute[];
  };
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

export type GetEntityChecksResponse = z.infer<typeof getEntityChecksResponse>;

export function defineEntityCheck<Id extends EntityCheckId>(
  value: EntityCheck<Id>
) {
  return value;
}
