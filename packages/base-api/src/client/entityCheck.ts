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
  entityObjectId: string,
  action: ActionType,
  payload: EntityCheckActionPayload<Id, ActionType>
) =>
  request(context, {
    url: `/entity/${entityId}/${entityObjectId}/check/${checkId}/${action}`,
    method: 'POST',
    body: payload && jsonInit(payload),
  });
