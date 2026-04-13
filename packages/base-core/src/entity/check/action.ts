import {
  GetPropertyOr,
  MaybePromise,
  PartialIf,
  RequiredProperty,
} from '@game-cms/shared';
import type { ObjectId } from 'mongodb';
import type { ZodType } from 'zod';

import { EntityId } from '../core.js';
import {
  EntityCheckId,
  EntityCheckStorageData,
  EntityCheckTypes,
} from './types.js';
import { EntityCheckWhenParams } from './when.js';

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

export interface EntityCheckExecuteActionParams<
  Id extends EntityCheckId,
  ActionType extends EntityCheckActionIds<Id>,
  EId extends EntityId = EntityId,
> extends RequiredProperty<EntityCheckWhenParams<Id, EId>, 'documentId'> {
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
