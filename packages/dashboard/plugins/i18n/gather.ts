import path from 'node:path';

import { env } from '@game-cms/global';
import { readDirectoryIfExists } from '@game-cms/shared/node';

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

const TRANSLATION_EXTENSION = '.json';

async function getDistributionI18n(
  distPath: string
): Promise<DistributionI18n> {
  const dataDir = path.join(distPath, '../i18n');
  const entries = await readDirectoryIfExists(dataDir, { withFileTypes: true });

  return {
    languages: Object.fromEntries(
      entries
        .filter(
          (entry) =>
            entry.isFile() && entry.name.endsWith(TRANSLATION_EXTENSION)
        )
        .map(({ name }) => [
          name.slice(0, -TRANSLATION_EXTENSION.length),
          { filePath: path.join(dataDir, name) },
        ])
    ),
  };
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
