// @ts-expect-error it's correct.
import type { RouteParameters } from '@types/express-serve-static-core';
import type { RequestHandler } from 'express';

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

export type ApiRoute<Path extends string = string> = Readonly<{
  path: Path;
  method: HttpMethod;
  exact?: boolean;
  handler: RequestHandler<RouteParameters<Path>>;
}>;
