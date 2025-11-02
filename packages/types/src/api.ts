import type {
  ContextConfigDefault,
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

export type HttpMethodWithBody = 'POST' | 'PUT' | 'PATCH';
export type HttpMethodWithNoBody = Exclude<HttpMethod, HttpMethodWithBody>;

/*

type BaseApiRoute = {
  exact?: boolean;
};

export type BodyValidator<
  T = unknown,
  Path extends string = string,
> = MaybeFactory<ZodType<T>, [FastifyRequest<Path>]>;

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
*/

export type ApiRoute<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends
    RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends
    RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = ZodTypeProvider,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = RouteOptions<
  RawServer,
  RawRequest,
  RawReply,
  RouteGeneric,
  ContextConfig,
  SchemaCompiler,
  TypeProvider,
  Logger
> & {
  exact?: boolean;
};
