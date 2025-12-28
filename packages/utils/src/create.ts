import type { MaybePromise } from '@game-cms/shared';
import type { EnvAccessor } from '@game-cms/shared/io';
import type {
  ApiRoute,
  ComponentController,
  ComponentId,
  Service,
  UnresolvedCmsConfig,
} from '@game-cms/types';
import type {
  FastifyBaseLogger,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
} from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;

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

/*@__NO_SIDE_EFFECTS__*/
export function service<const T extends Service>(value: T): T {
  return value;
}

/*@__NO_SIDE_EFFECTS__*/
export function component<Id extends ComponentId>(
  value: ComponentController<Id>
) {
  return value;
}

export function config(value: ConfigInit): ConfigInit {
  return value;
}
