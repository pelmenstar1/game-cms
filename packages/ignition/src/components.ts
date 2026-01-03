import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type {
  ComponentController,
  ComponentControllerMap,
  ValueSourceContext,
} from '@game-cms/core';
import type { ComponentEnv } from '@game-cms/global';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { importFile } from '@game-cms/shared/io';

export async function getAllComponentDistributions(
  context: ValueSourceContext
) {
  const { plugins } = context.config;

  const result = await Promise.all(
    plugins.map(
      async ({ components }) =>
        components && (await resolveAsyncMaybeFactory(components, context))
    )
  );

  return filterOutNullable(result).map(
    ({ distributionPath }) => distributionPath
  );
}

async function getDistributionControllers(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        const controllerPath = path.join(distPath, entry.name, 'controller.js');

        if (fs.existsSync(controllerPath)) {
          const { default: controller } = await importFile<{
            default: ComponentController;
          }>(controllerPath);

          return controller;
        }
      }
    })
  );

  return filterOutNullable(result);
}

export async function getComponentEnv(
  context: ValueSourceContext
): Promise<ComponentEnv> {
  const distributions = await getAllComponentDistributions(context);

  const controllers = await Promise.all(
    distributions.map((distPath) => getDistributionControllers(distPath))
  );

  const controllerMap = Object.fromEntries(
    controllers.flat().map((controller) => [controller.meta.id, controller])
  ) as ComponentControllerMap;

  return {
    distributions,
    controllers: controllerMap,
  };
}
