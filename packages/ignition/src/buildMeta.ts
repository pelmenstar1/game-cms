import fsp from 'node:fs/promises';
import path from 'node:path';

import { isFileNotFoundError, readJson } from '@game-cms/shared/node';
import z from 'zod';

export const DASHBOARD_BUILD_META_FILE_PATH = './.game-cms/meta.json';

export const dashboardBuildMeta = z.object({
  basePath: z.string(),
  devMessagePort: z.number().optional(),
});

export type DashboardBuildMeta = z.infer<typeof dashboardBuildMeta>;

export async function writeDashboardBuildMeta(
  dashboardPath: string,
  devMessagePort?: number
) {
  const meta: DashboardBuildMeta = {
    basePath: process.cwd(),
    devMessagePort,
  };

  await fsp.writeFile(
    path.join(dashboardPath, DASHBOARD_BUILD_META_FILE_PATH),
    JSON.stringify(meta),
    'utf8'
  );
}

async function tryReadRawBuildMeta() {
  try {
    return await readJson(DASHBOARD_BUILD_META_FILE_PATH);
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function readDashboardBuildMeta() {
  const raw = await tryReadRawBuildMeta();

  return raw !== null ? dashboardBuildMeta.parse(raw) : null;
}
