import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';

function emitGetEntitySchemas() {
  const { entities } = env();

  return `
export const fullEntityMap = {
  ${entities.map((descriptor) => `'${descriptor.id}': import('${pathToFileURL(descriptor.filePath)}')`)}
};

export const metaMap = {
  ${entities.map(({ id, title }) => `'${id}': ${JSON.stringify({ title })}`)}
};
`;
}

export function emitEntityConnector(): string {
  return emitGetEntitySchemas();
}
