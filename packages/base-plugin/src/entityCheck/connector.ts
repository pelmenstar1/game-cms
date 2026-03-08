import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';

export function emitEntityCheckConnector() {
  const entityChecks = env().config.entity?.checks ?? [];

  return `
export default {
  ${entityChecks
    .map(({ id, dashboard }) => {
      const renderer = dashboard?.entityAccessRenderer;

      if (renderer) {
        return { id: id as string, renderer };
      }
    })
    .filter((pair) => pair !== undefined)
    .map(
      ({ id, renderer }) =>
        `${JSON.stringify(id)}: () => import('${pathToFileURL(renderer.filePath)}')`
    )
    .join(',')}
}`;
}
