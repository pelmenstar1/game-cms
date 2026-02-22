import {
  EntityCheckActionIds,
  EntityCheckActionPayload,
  EntityCheckId,
  EntityId,
} from '@game-cms/base-core';
import { jsonInit, request, RequestContext } from '@game-cms/core/api/client';

export const invokeEntityCheckAction = <
  Id extends EntityCheckId,
  ActionType extends EntityCheckActionIds<Id>,
>(
  context: RequestContext,
  checkId: Id,
  entityId: EntityId,
  documentId: string,
  action: ActionType,
  payload: EntityCheckActionPayload<Id, ActionType>
) =>
  request(context, {
    url: `/entity/${entityId}/${documentId}/check/${checkId}/${action}`,
    method: 'POST',
    body: payload && jsonInit(payload),
  });
