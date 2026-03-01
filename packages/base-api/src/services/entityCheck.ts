import type {
  EntityCheck,
  EntityCheckActionDescriptor,
  EntityCheckClientDataMap,
  EntityCheckStorageData,
} from '@game-cms/base-core';
import type {
  BaseEntityStorageDataById,
  EntityCheckActionIds,
  EntityCheckActionPayload,
  EntityCheckId,
  EntityCheckStorageDataMap,
  EntityId,
  EntityMeta,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';
import type { ObjectId } from 'mongodb';

type RunEntityChecksParams<Id extends EntityId> = {
  entityId: Id;
  id?: ObjectId;
  entityMeta: EntityMeta;
  entityData: BaseEntityStorageDataById<Id> & {
    checks?: EntityCheckStorageDataMap;
  };
};

function getAll() {
  return env().config.entity?.checks ?? [];
}

function getById<Id extends EntityCheckId>(id: Id) {
  const check = getAll().find((check) => check.id === id);

  if (!check) {
    throw new ApiError('Unknown check', 'base::entity/notFound');
  }

  return check as EntityCheck<Id>;
}

function getActionById<
  Id extends EntityCheckId,
  Action extends EntityCheckActionIds<Id>,
>(id: Id, actionId: Action) {
  const check = getById(id);
  const action = check.actions?.[actionId] as unknown as
    | EntityCheckActionDescriptor<Id, Action>
    | undefined;

  if (!action) {
    throw new ApiError('Unknown action', 'base::entity/notFound');
  }

  return action;
}

async function runEntityChecks<Id extends EntityId>({
  id,
  entityId,
  entityData,
  entityMeta,
}: RunEntityChecksParams<Id>) {
  const checks = getAll();

  await Promise.all(
    checks.map(async (check) => {
      const { checks, ...restEntityData } = entityData;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const storageData = checks?.[check.id];

      const condition =
        (await check.when?.({
          entityId,
          id,
          entityMeta,
          storageData,
        })) ?? true;

      if (condition) {
        await check.execute({
          entityId,
          id,
          entityData:
            restEntityData as unknown as BaseEntityStorageDataById<Id>,
          entityMeta,
        });
      }
    })
  );
}

type InvokeActionParams<
  Id extends EntityCheckId,
  Action extends EntityCheckActionIds<Id>,
> = {
  id: Id;
  entityId: EntityId;
  entityObjectId: ObjectId;
  actionId: Action;
  actionPayload: EntityCheckActionPayload<Id, Action>;
  actorId: ObjectId;
};

async function invokeAction<
  Id extends EntityCheckId,
  Action extends EntityCheckActionIds<Id>,
>(params: InvokeActionParams<Id, Action>) {
  const action = getActionById(params.id, params.actionId);

  const entityData = await cms()
    .service('base::database')
    .entityCollection(params.entityId)
    .findOne(
      { _id: params.entityObjectId },
      {
        projection: {
          draft: { meta: 1, checks: 1 },
        },
      }
    );

  if (!entityData) {
    throw new ApiError('Unknown entity object', 'base::entity/notFound');
  }

  const entityVariantData = entityData.draft;

  const newStorageData = await action.execute({
    entityId: params.entityId,
    payload: params.actionPayload,
    entityMeta: entityVariantData.meta,
    storageData: entityVariantData.checks?.[
      params.actionId
    ] as EntityCheckStorageData<Id>,
    id: params.entityObjectId,
    context: {
      actorId: params.actorId,
    },
  });

  await cms()
    .service('base::database')
    .entityCollection(params.entityId)
    .updateOne(
      { _id: params.entityObjectId },
      { $set: { [`draft.checks.${params.id}`]: newStorageData } }
    );
}

function validateActionPayload<
  Id extends EntityCheckId,
  Action extends EntityCheckActionIds<Id>,
>(
  id: Id,
  actionId: Action,
  value: unknown
): EntityCheckActionPayload<Id, Action> {
  const { payloadSchema } = getActionById(id, actionId);

  if (payloadSchema) {
    const result = payloadSchema.safeParse(value);
    if (result.error) {
      throw new ApiError(
        'Invalid action payload',
        'base::schema/validation',
        null,
        { cause: result.error }
      );
    }

    return result.data;
  }

  return value as EntityCheckActionPayload<Id, Action>;
}

export default service({
  id: 'base::entityCheck',
  getAll,
  run: runEntityChecks,
  invokeAction,
  validateActionPayload,
  getClientData: async (
    entityId: EntityId,
    entityMeta: EntityMeta,
    entityObjectId: ObjectId,
    data: EntityCheckStorageDataMap
  ): Promise<EntityCheckClientDataMap> => {
    const entries = await Promise.all(
      getAll().map(async (check) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, when, getClientData } = check;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const storageData = data[id];

        const params = {
          entityId,
          entityMeta,
          id: entityObjectId,
          storageData,
        };

        if (when === undefined || (await when(params))) {
          const value = getClientData
            ? await getClientData(params)
            : storageData;

          return [id, value] as const;
        }
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Object.fromEntries(filterOutNullable(entries));
  },
});
