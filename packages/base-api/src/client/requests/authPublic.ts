import type {
  GetPublicPermissionsResponse,
  UpdatePublicPermissionsPayload,
} from '@game-cms/base-core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
} from '@game-cms/core/api/client';

export const getPublicPermissions = (context: RequestContext) =>
  request(context, {
    url: '/auth/permissions/public',
    response: json<GetPublicPermissionsResponse>(),
  });

export const updatePublicPermissions = (
  context: RequestContext,
  payload: UpdatePublicPermissionsPayload
) =>
  request(context, {
    url: '/auth/permissions/public',
    method: 'PUT',
    body: jsonInit(payload),
  });
