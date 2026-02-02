import '@game-cms/core/api';

import { ToClientType } from '@game-cms/core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
} from '@game-cms/core/api/client';

import { GetReviewersResponse, UpdateReviewersPayload } from './types.js';

declare module '@game-cms/core/api' {
  interface ApiRouteMap {
    'GET /entityCheck/base$review/reviewers': null;
    'PUT /entityCheck/base$review/reviewers': null;
  }
}

export const getReviewers = (context: RequestContext) =>
  request(context, {
    url: '/entityCheck/base$review/reviewers',
    response: json<GetReviewersResponse>(),
  });

export const updateReviewers = (
  context: RequestContext,
  payload: ToClientType<UpdateReviewersPayload>
) =>
  request(context, {
    method: 'PUT',
    url: '/entityCheck/base$review/reviewers',
    body: jsonInit(payload),
    response: json<GetReviewersResponse>(),
  });
