import type {
  AnyPlugin,
  PluginValueSource,
  PluginValueSourceContext,
  ServiceMap,
} from '@game-cms/core';
import type { ApiEnvironment } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { mergeObjects } from '@game-cms/shared/object';

function getApiRouteSourceFromPlugin(plugin: AnyPlugin) {
  const routes = plugin.config?.api?.routes;

  return routes ? ('source' in routes ? routes.source : routes) : undefined;
}

async function resolvePluginValueSource<T>(
  context: PluginValueSourceContext,
  getSource: (plugin: AnyPlugin) => PluginValueSource<T[]> | undefined
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

  return result.flat().filter((value) => value !== undefined);
}

async function getApiRoutes(context: PluginValueSourceContext) {
  return resolvePluginValueSource(context, getApiRouteSourceFromPlugin);
}

function getErrorStatusCodes(context: PluginValueSourceContext) {
  const result = filterOutNullable(
    context.config.plugins.map((plugin) => plugin.config?.api?.error?.statuses)
  );

  return mergeObjects(result);
}

export async function getAllServices(context: PluginValueSourceContext) {
  const { plugins } = context.config;
  const allServices: Partial<ServiceMap> = {};

  for (const plugin of plugins) {
    const servicesSource = plugin.services;

    if (servicesSource) {
      const services = await resolveAsyncMaybeFactory(servicesSource, context);

      Object.assign(allServices, services);
    }
  }

  return allServices as ServiceMap;
}

export async function getApiConfig(
  context: PluginValueSourceContext
): Promise<ApiEnvironment> {
  const routes = await getApiRoutes(context);
  const statusCodes = getErrorStatusCodes(context);

  return {
    routes,
    statusCodes,
  };
}
