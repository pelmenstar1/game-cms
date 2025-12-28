import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { DASHBOARD_COMPONENTS_PATH } from '@game-cms/build';
import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { importFile, loadEnvFileIfExists } from '@game-cms/shared/io';
import type {
  ComponentController,
  ComponentControllerMap,
  ComponentsFsInfo,
  ValueSourceContext,
} from '@game-cms/types';

import { resolveConfig } from './config.js';
import { compiledFilePath } from './localPath.js';

export async function getAllComponents(context: ValueSourceContext) {
  const { plugins } = context.config;

  const result = await Promise.all(
    plugins.map(async ({ components }) =>
      components ? resolveAsyncMaybeFactory(components, context) : undefined
    )
  );

  return filterOutNullable(result);
}

async function getDistributionControllers(distPath: string) {
  const entries = await fsp.readdir(distPath, { withFileTypes: true });

  const result = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        const controllerPath = path.join(distPath, entry.name, 'index.js');

        if (fs.existsSync(controllerPath)) {
          return importFile<{ default: ComponentController }>(controllerPath);
        }
      }
    })
  );

  return filterOutNullable(result);
}

export async function getAllComponentControllers(context: ValueSourceContext) {
  const components = await getAllComponents(context);

  const controllers = await Promise.all(
    components.map((value) =>
      getDistributionControllers(value.distributionPath)
    )
  );

  return Object.fromEntries(
    controllers
      .flat()
      .map(({ default: controller }) => [controller.meta.id, controller])
  ) as ComponentControllerMap;
}

export async function generateComponentsFsInfo(): Promise<ComponentsFsInfo> {
  await loadEnvFileIfExists();

  const config = await resolveConfig();
  const components = await getAllComponents({ config, compiledFilePath });

  console.log(components);

  return {
    distributions: components.map((value) => value.distributionPath),
  };
}

export async function writeComponentsFsInfo(dashboardPath: string) {
  const info = await generateComponentsFsInfo();

  const filePath = path.join(dashboardPath, DASHBOARD_COMPONENTS_PATH);

  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, JSON.stringify(info), 'utf8');
}
