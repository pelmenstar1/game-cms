import type { ApiEnvironment } from '@game-cms/env';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { mergeObjects } from '@game-cms/shared/object';
import type {
  Plugin,
  PluginValueSource,
  ValueSourceContext,
} from '@game-cms/types';

function getApiRouteSourceFromPlugin(plugin: Plugin) {
  const routes = plugin.api?.routes;

  return routes ? ('source' in routes ? routes.source : routes) : undefined;
}

async function resolvePluginValueSource<T>(
  context: ValueSourceContext,
  getSource: (plugin: Plugin) => PluginValueSource<T[]> | undefined
): Promise<T[]> {
  const { plugins } = context.config;

  const result = await Promise.all(
    plugins.map(async (plugin) => {
      const source = getSource(plugin);

      return source
        ? await resolveAsyncMaybeFactory(source, context)
        : undefined;
    })
  );

  return result.flat().filter((value) => value !== undefined) as T[];
}

async function getApiRoutes(context: ValueSourceContext) {
  return resolvePluginValueSource(context, getApiRouteSourceFromPlugin);
}

function getErrorStatusCodes(context: ValueSourceContext) {
  const result = filterOutNullable(
    context.config.plugins.map((plugin) => plugin.api?.error?.statuses)
  );

  return mergeObjects(result);
}

export async function getAllServices(context: ValueSourceContext) {
  return resolvePluginValueSource(context, (plugin) => plugin.services);
}

export async function getApiConfig(
  context: ValueSourceContext
): Promise<ApiEnvironment> {
  const routes = await getApiRoutes(context);
  const statusCodes = getErrorStatusCodes(context);

  return {
    routes,
    statusCodes,
  };
}
