import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';

export function emitEntityConnector(): string {
  const {
    entity: { schemaRegistry, clientContextRegistry },
  } = env();

  const entityMetaMap = Object.entries(schemaRegistry.items)
    .map(
      ([id, { schema }]) =>
        `${JSON.stringify(id)}: ${JSON.stringify({ title: schema.title })}`
    )
    .join(',');

  const getClientContextRegistry = clientContextRegistry
    ? `import('${pathToFileURL(clientContextRegistry.filePath)}')`
    : 'Promise.resolve({})';

  return `
export const getClientContextRegistry = () => ${getClientContextRegistry};
export const entityMetaMap = {${entityMetaMap}};`;
}
