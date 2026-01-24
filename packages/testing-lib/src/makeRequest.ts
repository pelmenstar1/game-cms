import type { HttpMethod } from '@game-cms/core/api';
import type { MaybePromise } from '@game-cms/shared';
import {
  fastify,
  type FastifyInstance,
  type FastifyRequest,
  type InjectOptions,
  type RouteShorthandOptions,
} from 'fastify';

export type MakeRequestInjectOptions = Omit<InjectOptions, 'url' | 'path'>;

export type MakeRequestOptions<T> = {
  inject?: MakeRequestInjectOptions;
  routeOptions?: RouteShorthandOptions & {
    method?: Exclude<HttpMethod, 'TRACE' | 'CONNECT'>;
  };

  factory: (req: FastifyRequest) => MaybePromise<T>;
  setup?: (app: FastifyInstance) => MaybePromise<void>;
};

export async function makeRequest<T>(options: MakeRequestOptions<T>) {
  const app = fastify();
  await options.setup?.(app);

  let lastError: unknown;

  const routeOptions = options.routeOptions ?? {};
  const method = routeOptions.method ?? 'GET';

  app.route({
    method,
    url: '/',
    handler: async (req) => {
      try {
        // Wrap in result field, because T might be undefined - return something resembling meaningful
        return { result: await options.factory(req) };
      } catch (error: unknown) {
        lastError = error;

        throw error;
      }
    },
    ...routeOptions,
  });

  const res = await app.inject({ path: '/', method, ...options.inject });

  // Re-throw the original error in current promise
  if (lastError !== undefined) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw lastError;
  }

  // If the request failed for some other reason, not because of exception.
  if (res.statusCode !== 200) {
    throw new Error(`Status code: ${res.statusCode}`);
  }

  const { result } = res.json<{ result: T }>();

  return result;
}
