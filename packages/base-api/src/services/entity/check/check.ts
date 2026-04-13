import type {
  EntityCheckActionIds,
  EntityCheckActionPayload,
  EntityCheckId,
  EntityCheckRunStatus,
  EntityCheckStorageDataMap,
  EntityDocumentMeta,
  EntityId,
} from '@game-cms/base-core';
import {
  createMemoryEntityCheckLogger,
  type EntityCheck,
  type EntityCheckActionDescriptor,
  type EntityCheckClientDataMap,
  type EntityCheckStorageData,
  type EntityStorageDataById,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import { JsonValue } from '@game-cms/shared';
import { fromEntriesNullable } from '@game-cms/shared/object';
import type { ObjectId } from 'mongodb';

type RunEntityChecksParams<Id extends EntityId> = {
  entityId: Id;
  documentId: ObjectId;
  documentData: Pick<
    EntityStorageDataById<Id>,
    'components' | 'checks' | 'meta'
  >;
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

async function runEntityCheck<Id extends EntityCheckId, EId extends EntityId>(
  check: EntityCheck<Id>,
  params: RunEntityChecksParams<EId>
) {
  const { entityId, documentId, documentData } = params;
  const { checks, meta, components } = documentData;

  const storageData = checks?.[check.id] as
    | EntityCheckStorageData<Id>
    | undefined;

  const whenParams = {
    entityId,
    documentId,
    storageData,
    documentMeta: meta,
    documentData: components,
  };

  const condition = (await check.when?.(whenParams)) ?? true;

  if (condition) {
    const logger = createMemoryEntityCheckLogger();
    let status: EntityCheckRunStatus = 'success';

    try {
      await check.execute({ ...whenParams, logger });
    } catch (error) {
      let args: JsonValue | undefined;

      if (error instanceof Error) {
        args = {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        };
      }

      status = 'failed';
      logger.error('Check execution failed', args);
    }

    await cms().service('base::entityCheck::run').addRun({
      checkId: check.id,
      entityId,
      documentId,
      status,
      logEntries: logger.entries,
    });
  }
}

async function runEntityChecks<Id extends EntityId>(
  params: RunEntityChecksParams<Id>
) {
  const checks = getAll();

  await Promise.all(checks.map((check) => runEntityCheck(check, params)));
}

type InvokeActionParams<
  Id extends EntityCheckId,
  Action extends EntityCheckActionIds<Id>,
> = {
  id: Id;
  entityId: EntityId;
  entityDocumentId: ObjectId;
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
      { _id: params.entityDocumentId },
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
    documentMeta: entityVariantData.meta,
    storageData: entityVariantData.checks?.[params.actionId] as
      | EntityCheckStorageData<Id>
      | undefined,
    documentId: params.entityDocumentId,
    context: {
      actorId: params.actorId,
    },
  });

  await cms()
    .service('base::database')
    .entityCollection(params.entityId)
    .updateOne(
      { _id: params.entityDocumentId },
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

async function getCheckClientDataEntry<Id extends EntityCheckId>(
  check: EntityCheck<Id>,
  entityId: EntityId,
  documentMeta: EntityDocumentMeta,
  documentId: ObjectId,
  storageData: EntityCheckStorageData<Id>
) {
  const { id, when, getClientData } = check;

  const params = { entityId, documentMeta, documentId, storageData };

  if (when === undefined || (await when(params))) {
    const value = getClientData ? await getClientData(params) : storageData;

    return [id, value] as const;
  }
}

async function getClientData(
  entityId: EntityId,
  documentMeta: EntityDocumentMeta,
  documentId: ObjectId,
  data: EntityCheckStorageDataMap
): Promise<EntityCheckClientDataMap> {
  const entries = await Promise.all(
    getAll().map((check) =>
      getCheckClientDataEntry(
        check,
        entityId,
        documentMeta,
        documentId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        data[check.id]
      )
    )
  );

  return fromEntriesNullable(entries);
}

export default service({
  lifecycle: {},
  getAll,
  run: runEntityChecks,
  invokeAction,
  validateActionPayload,
  getClientData,
});
