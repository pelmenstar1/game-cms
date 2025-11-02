import type { ApiRoute, BodyValidator, RouteParameters } from '@game-cms/types';
import type { Request, Response } from 'express';
import type { ZodType } from 'zod';

function resolveValidator<T, Path extends string>(
  validator: BodyValidator<T, Path>,
  req: Request<RouteParameters<Path>>
): ZodType<T> {
  if (typeof validator === 'function') {
    return validator(req);
  }

  return validator;
}

function validateBody(
  validator: BodyValidator,
  req: Request,
  res: Response
): boolean {
  const type = resolveValidator(validator, req);

  const result = type.safeParse(req.body);
  if (!result.success) {
    res.status(400).send(result.error.message).end();

    return false;
  }

  return true;
}

export function validateRouteInput(
  route: ApiRoute,
  req: Request,
  res: Response
): boolean {
  if ('validation' in route) {
    const bodyValidator = route.validation?.body;

    if (bodyValidator && !validateBody(bodyValidator, req, res)) {
      return false;
    }
  }

  return true;
}
