import {
  ClientConciseEntityCheckRunWithId,
  ClientEntityCheckRunWithId,
  EntityCheckActionIds,
  EntityCheckActionPayload,
  EntityCheckId,
  EntityId,
  ListEntityCheckRunsOptions,
} from '@game-cms/base-core';
import { ToClientType } from '@game-cms/core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
  url,
} from '@game-cms/core/api/client';
import { PageData } from '@game-cms/shared';

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

export const getEntityCheckRun = (context: RequestContext, id: string) =>
  request(context, {
    url: `/entityCheck/runs/${id}`,
    method: 'GET',
    response: json<ClientEntityCheckRunWithId>(),
  });

export const listEntityCheckRuns = (
  context: RequestContext,
  options: ToClientType<ListEntityCheckRunsOptions>
) =>
  request(context, {
    url: url({ path: '/entityCheck/runs', search: options }),
    method: 'GET',
    response: json<PageData<ClientConciseEntityCheckRunWithId>>(),
  });
