import fsp from 'node:fs/promises';
import path from 'node:path';

import { env } from '@game-cms/global';
import { isFileNotFoundError } from '@game-cms/shared/errors';

type DistributionI18n = {
  languages: Partial<
    Record<
      string,
      {
        filePath: string;
      }
    >
  >;
};

export type ComponentI18n = {
  pluginId: string;
  i18n: DistributionI18n;
}[];

async function getDistributionI18n(
  distPath: string
): Promise<DistributionI18n> {
  const dataDir = path.join(distPath, '../i18n');

  try {
    const entries = await fsp.readdir(dataDir);

    return {
      languages: Object.fromEntries(
        entries
          .filter((name) => name.endsWith('.json'))
          .map((name) => [
            name.slice(0, -'.json'.length),
            { filePath: path.join(dataDir, name) },
          ])
      ),
    };
  } catch (error: unknown) {
    if (!isFileNotFoundError(error)) {
      throw error;
    }
  }

  return { languages: {} };
}

export function gatherComponentI18n(): Promise<ComponentI18n> {
  const { components } = env();

  return Promise.all(
    components.distributions.map(async ({ directoryPath, pluginId }) => ({
      pluginId,
      i18n: await getDistributionI18n(directoryPath),
    }))
  );
}
