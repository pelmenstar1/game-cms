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

export type ApiRouteId = `${string}$${string}`;

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
