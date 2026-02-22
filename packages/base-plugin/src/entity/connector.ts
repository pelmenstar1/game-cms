import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';

function emitDynamicPromise(filePath: string) {
  return `() => import('${pathToFileURL(filePath)}')`;
}

export function emitEntityConnector(): string {
  const {
    entity: { registry, registryFilePath },
  } = env();

  return `
export const registryImport = ${emitDynamicPromise(registryFilePath)};

export const entityMap = {
  ${Object.entries(registry)
    .map(([id, { title, filePath }]) => {
      const schemaImport = filePath
        ? `schema: ${emitDynamicPromise(filePath)}`
        : '';

      return `'${id}': { title: ${JSON.stringify(title)}, ${schemaImport} }`;
    })
    .join(',')}
};`;
}
