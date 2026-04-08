import fsp from 'node:fs/promises';
import path from 'node:path';

import type {
  ComponentController,
  ComponentControllerMap,
  PluginValueSourceContext,
} from '@game-cms/core';
import type { ComponentDistributionInfo, ComponentEnv } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { maybeImportFile } from '@game-cms/shared/node';

export async function getAllComponentDistributions(
  context: PluginValueSourceContext
): Promise<ComponentDistributionInfo[]> {
  const { plugins } = context.config;

  const result = await Promise.all(
    plugins.map(async ({ id, components }) => {
      if (components) {
        const { distributionPath } = await resolveAsyncMaybeFactory(
          components,
          context
        );

        return {
          pluginId: id,
          directoryPath: distributionPath,
        };
      }
    })
  );

  return filterOutNullable(result);
}

async function getDistributionControllers(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        const controllerPath = path.join(distPath, entry.name, 'controller.js');

        const controllerModule = await maybeImportFile<{
          default: ComponentController;
        }>(controllerPath);

        if (controllerModule !== undefined) {
          return controllerModule.default;
        }
      }
    })
  );

  return filterOutNullable(result);
}

export async function getComponentEnv(
  context: PluginValueSourceContext
): Promise<ComponentEnv> {
  const distributions = await getAllComponentDistributions(context);

  const controllers = await Promise.all(
    distributions.map(({ directoryPath }) =>
      getDistributionControllers(directoryPath)
    )
  );

  const controllerMap = Object.fromEntries(
    controllers.flat().map((controller) => [controller.core.id, controller])
  ) as ComponentControllerMap;

  return {
    distributions,
    controllers: controllerMap,
  };
}
