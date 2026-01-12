import type {
  FastifyBaseLogger,
  FastifySchema,
  FastifyTypeProvider,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions,
} from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import type z from 'zod';

import type { apiRouteId } from '../schema/api.js';

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

export type HttpMethodWithBody = 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type HttpMethodWithNoBody = Exclude<HttpMethod, HttpMethodWithBody>;

export type ApiRouteId = z.infer<typeof apiRouteId>;

export type ApiRouteContextConfig = {
  exact?: boolean;
  id?: ApiRouteId;
};

export type ApiRoute<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> =
    RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> =
    RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = ZodTypeProvider,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = RouteOptions<
  RawServer,
  RawRequest,
  RawReply,
  RouteGeneric,
  ApiRouteContextConfig,
  SchemaCompiler,
  TypeProvider,
  Logger
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownApiRoute = ApiRoute<any, any, any, any, any, any, any>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiRouteMap {}

/*@__NO_SIDE_EFFECTS__*/
export function apiRoute<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> =
    RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> =
    RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  SchemaCompiler extends FastifySchema = FastifySchema,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
  route: ApiRoute<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    SchemaCompiler,
    ZodTypeProvider,
    Logger
  >
) {
  return route;
}

export function parseApiRouteId(id: ApiRouteId) {
  const delimiterIndex = id.indexOf('$');
  if (delimiterIndex == -1) {
    throw new Error(`Invalid API route ID: ${id}`);
  }

  return {
    namespace: id.slice(0, delimiterIndex),
    action: id.slice(delimiterIndex + 1),
  };
}
