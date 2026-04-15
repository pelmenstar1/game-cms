import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';

export function emitEntityCheckConnector() {
  const entityChecks = env().config.entity?.checks ?? [];

  return `
export default {
  ${entityChecks
    .map(({ id, clientOptions, dashboard }) => {
      const controllerPath = dashboard?.clientController?.filePath;

      const controllerDef = controllerPath
        ? `controller: () => import('${pathToFileURL(controllerPath)}')`
        : '';

      const optionsDef = clientOptions
        ? `options: ${JSON.stringify(clientOptions)},`
        : '';

      return `${JSON.stringify(id)}: {
          ${optionsDef}
          ${controllerDef}
        }`;
    })
    .join(',')}
}`;
}
