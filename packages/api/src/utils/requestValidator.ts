import { resolveMaybeFactory } from '@game-cms/shared';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import type { ApiRoute, BodyValidator } from '@game-cms/types';
import type { Request } from 'express';

function validateBody(validator: BodyValidator, req: Request) {
  const type = resolveMaybeFactory(validator, req);

  const result = type.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(result.error.message, ApiErrorCode.VALIDATION_ISSUE);
  }
}

export function validateRouteInput(route: ApiRoute, req: Request) {
  if ('validation' in route) {
    const bodyValidator = route.validation?.body;

    if (bodyValidator) {
      validateBody(bodyValidator, req);
    }
  }
}
