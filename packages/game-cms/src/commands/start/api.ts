import { resolveAsyncMaybeFactory } from '@game-cms/shared';
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

export async function getApiRoutes(context: ValueSourceContext) {
  return resolvePluginValueSource(context, getApiRouteSourceFromPlugin);
}

export async function getAllServices(context: ValueSourceContext) {
  return resolvePluginValueSource(context, (plugin) => plugin.services);
}
