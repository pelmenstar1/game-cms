import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';
import { nameGenerator } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import type { Plugin } from 'vite';

import { type ComponentI18n, gatherComponentI18n } from './gather.js';

const MODULE_ID = 'virtual:dashboard/i18nData';

export function i18nPlugin(): Plugin {
  let componentI18n: ComponentI18n;

  return {
    name: 'dashboard:i18n',
    async buildStart() {
      componentI18n = await gatherComponentI18n();
    },
    resolveId(source) {
      if (source === MODULE_ID) {
        return source;
      }

      return null;
    },
    load(id) {
      if (id === MODULE_ID) {
        const language = env().config.i18n?.language ?? 'en';

        const nameGen = nameGenerator();

        const resourceEntries = filterOutNullable(
          componentI18n.map(({ pluginId, i18n }) => {
            const filePath = i18n.languages[language]?.filePath;

            if (filePath) {
              return { varName: nameGen.create(pluginId), pluginId, filePath };
            }
          })
        );

        return `
${resourceEntries.map(({ varName, filePath }) => `import ${varName} from '${pathToFileURL(filePath)}';`).join('')}

export const resources = {
  '${language}': {
    ${resourceEntries.map(({ varName, pluginId }) => `'${pluginId}': ${varName}`).join('')}
  }
};

export const language = '${language}';`;
      }
    },
  };
}
