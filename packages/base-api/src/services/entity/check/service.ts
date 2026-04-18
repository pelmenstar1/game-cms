import type {
  EntityCheck,
  EntityCheckActionDescriptor,
  EntityCheckActionIds,
  EntityCheckActionPayload,
  EntityCheckClientDataMap,
  EntityCheckId,
  EntityCheckRun,
  EntityCheckRunStatus,
  EntityCheckStorageData,
  EntityCheckStorageDataMap,
  EntityDocumentMeta,
  EntityId,
  EntityStorageDataById,
  EntityVariant,
} from '@game-cms/base-core';
import { createMemoryEntityCheckLogger } from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms, env, log } from '@game-cms/global';
import { JsonValue, parseErrorStack } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { fromEntriesNullable } from '@game-cms/shared/object';
import type { ObjectId } from 'mongodb';

type RunEntityChecksParams<Id extends EntityId> = {
  entityId: Id;
  documentId?: ObjectId;
  documentVariant: EntityVariant;
  documentData: Pick<
    EntityStorageDataById<Id>,
    'components' | 'checks' | 'meta'
  >;
};

function getAll(): EntityCheck[] {
  return env().config.entity?.checks ?? [];
}

function getById<Id extends EntityCheckId>(id: Id) {
  const check = getAll().find((check) => check.id === id);

  if (!check) {
    throw new ApiError('Unknown check', { code: 'base::entity/notFound' });
  }

  return check as unknown as EntityCheck<Id>;
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
    throw new ApiError('Unknown action', { code: 'base::entity/notFound' });
  }

  return action;
}

function serializeError(error: unknown): JsonValue | undefined {
  if (Error.isError(error)) {
    return {
      error: {
        name: error.name,
        message: error.message,
        stack: parseErrorStack(error),
      },
    };
  }
}

async function runEntityCheck<Id extends EntityCheckId, EId extends EntityId>(
  check: EntityCheck<Id>,
  params: RunEntityChecksParams<EId>
): Promise<EntityCheckRun | undefined> {
  const { entityId, documentId, documentData, documentVariant } = params;
  const { checks, meta, components } = documentData;

  const storageData = checks?.[check.id] as
    | EntityCheckStorageData<Id>
    | undefined;

  const whenParams = {
    entityId,
    documentId,
    storageData,
    documentVariant,
    documentMeta: meta,
    documentData: components,
  };

  const condition = (await check.when?.(whenParams)) ?? true;

  if (condition) {
    const logger = createMemoryEntityCheckLogger();
    let status: EntityCheckRunStatus = 'success';

    const createdAt = new Date();

    try {
      await check.execute({ ...whenParams, logger });
    } catch (error) {
      const args = serializeError(error);

      status = 'failed';
      logger.error('Check execution failed', args);
    }

    const finishedAt = new Date();

    return {
      checkId: check.id,
      entityId,
      documentId,
      status,
      createdAt,
      finishedAt,
      logEntries: logger.entries,
    };
  }
}

async function runEntityChecks<Id extends EntityId>(
  params: RunEntityChecksParams<Id>
) {
  const checks = getAll();

  const results = await Promise.allSettled(
    checks.map((check) => runEntityCheck(check, params))
  );

  const runs = filterOutNullable(
    results.map((result, i): EntityCheckRun | undefined => {
      if (result.status === 'rejected') {
        log().error(result.reason);

        const now = new Date();

        return {
          checkId: checks[i].id,
          entityId: params.entityId,
          documentId: params.documentId,
          status: 'failed',
          createdAt: now,
          finishedAt: now,
          logEntries: [
            {
              level: 'error',
              message: 'Check execution failed (not during execution)',
              timestamp: now,
              args: serializeError(result.reason),
            },
          ],
        };
      }

      return result.value;
    })
  );

  const runsWithId = await cms()
    .service('base::entityCheck::run')
    .addRuns(runs);

  const failedRuns = runsWithId.filter((run) => run.status === 'failed');

  if (failedRuns.length > 0) {
    throw new ApiError('One or more entity checks failed', {
      code: 'base::entityCheck/fail',
      details: {
        failedRunIds: failedRuns.map((run) => run.id.toString()),
      },
    });
  }
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
  const documentVariant: EntityVariant = 'draft';
  const action = getActionById(params.id, params.actionId);

  const entityData = await cms()
    .service('base::database')
    .entityCollection(params.entityId)
    .findOne(
      { _id: params.entityDocumentId },
      {
        projection: {
          [documentVariant]: { meta: 1, checks: 1 },
        },
      }
    );

  if (!entityData) {
    throw new ApiError('Unknown entity object', {
      code: 'base::entity/notFound',
    });
  }

  const entityVariantData = entityData[documentVariant];

  const newStorageData = await action.execute({
    entityId: params.entityId,
    payload: params.actionPayload,
    storageData: entityVariantData.checks?.[params.actionId] as
      | EntityCheckStorageData<Id>
      | undefined,
    documentId: params.entityDocumentId,
    documentMeta: entityVariantData.meta,
    documentVariant,
    context: {
      actorId: params.actorId,
    },
  });

  await cms()
    .service('base::database')
    .entityCollection(params.entityId)
    .updateOne(
      { _id: params.entityDocumentId },
      { $set: { [`${documentVariant}.checks.${params.id}`]: newStorageData } }
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
      throw new ApiError('Invalid action payload', {
        code: 'base::schema/validation',
        options: { cause: result.error },
      });
    }

    return result.data;
  }

  return value as EntityCheckActionPayload<Id, Action>;
}

type GetCheckClientDataContext = {
  entityId: EntityId;
  documentId: ObjectId;
  documentMeta: EntityDocumentMeta;
  documentVariant: EntityVariant;
};

async function getCheckClientDataEntry<Id extends EntityCheckId>(
  check: EntityCheck<Id>,
  storageData: EntityCheckStorageData<Id> | undefined,
  context: GetCheckClientDataContext
) {
  const { id, getClientData } = check;

  const params = {
    storageData,
    ...context,
  };

  const value = getClientData ? await getClientData(params) : storageData;

  return [id, value] as const;
}

async function getClientData(
  data: EntityCheckStorageDataMap,
  context: GetCheckClientDataContext
): Promise<EntityCheckClientDataMap> {
  const entries = await Promise.all(
    getAll().map((check) =>
      getCheckClientDataEntry(check, data[check.id], context)
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
