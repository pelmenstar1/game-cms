import type {
  GetPublicPermissionsResponse,
  UpdatePublicPermissionsPayload,
} from '@game-cms/base-core';
import { json, type RequestContext } from '@game-cms/core/api';

import { request } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';

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
