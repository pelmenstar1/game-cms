import type { MaybeFactory } from '@game-cms/shared';
// @ts-expect-error it's correct.
import type { RouteParameters } from '@types/express-serve-static-core';

// @ts-expect-error it's correct.
export type { RouteParameters } from '@types/express-serve-static-core';

import type { Request, RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const httpMethods = [
  'OPTIONS',
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'TRACE',
  'CONNECT',
  'PATCH',
] as const;

export type HttpMethod = (typeof httpMethods)[number];

export type HttpMethodWithBody = 'POST' | 'PUT' | 'PATCH';
export type HttpMethodWithNoBody = Exclude<HttpMethod, HttpMethodWithBody>;

type BaseApiRoute = {
  exact?: boolean;
};

export type BodyValidator<
  T = unknown,
  Path extends string = string,
> = MaybeFactory<ZodType<T>, [Request<RouteParameters<Path>>]>;

interface NonBodyRoute<Path extends string> extends BaseApiRoute {
  path: Path;
  method: HttpMethodWithNoBody;
  handler: RequestHandler<RouteParameters<Path>>;
}

interface BodyRoute<Path extends string, Body> extends BaseApiRoute {
  path: Path;
  method: HttpMethodWithBody;
  validation?: {
    body?: BodyValidator<Body, Path>;
  };
  handler: RequestHandler<RouteParameters<Path>, unknown, Body>;
}

export type ApiRoute<Path extends string = string, Body = unknown> = Readonly<
  NonBodyRoute<Path> | BodyRoute<Path, Body>
>;
