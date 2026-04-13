import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';

export function emitEntityCheckConnector() {
  const entityChecks = env().config.entity?.checks ?? [];

  return `
export default {
  ${entityChecks
    .map(({ id, dashboard }) => {
      const controller = dashboard?.clientController;

      if (controller) {
        return { id: id as string, controller };
      }
    })
    .filter((pair) => pair !== undefined)
    .map(
      ({ id, controller }) =>
        `${JSON.stringify(id)}: () => import('${pathToFileURL(controller.filePath)}')`
    )
    .join(',')}
}`;
}
