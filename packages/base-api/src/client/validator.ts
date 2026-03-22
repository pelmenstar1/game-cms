import { ComponentCustomValidatorResult } from '@game-cms/base-core';
import { ComponentDataValidatorParams } from '@game-cms/core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
  url,
} from '@game-cms/core/api/client';

export const checkCustomValidation = (
  context: RequestContext,
  id: string,
  data: unknown,
  params?: ComponentDataValidatorParams
) =>
  request(context, {
    method: 'POST',
    url: url({ path: `/validator/check/${id}`, search: params }),
    body: jsonInit(data),
    response: json<ComponentCustomValidatorResult>(),
  });
