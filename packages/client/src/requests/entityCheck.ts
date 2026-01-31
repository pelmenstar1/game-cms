import {
  EntityCheckActionIds,
  EntityCheckActionPayload,
  EntityCheckId,
  EntityId,
} from '@game-cms/base-core';
import { RequestContext } from '@game-cms/core/api';

import { jsonInit } from '../requestInitializer.js';
import { request } from '../utils.js';

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
