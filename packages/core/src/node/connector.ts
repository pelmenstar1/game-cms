import { pathToFileURL } from 'node:url';

import { nameGenerator } from '@game-cms/shared';

import type { ComponentClientChunkMap } from './gather.js';

type EmitContext = {
  vars: { client: Record<string, string> };
};

type EmitStep = (info: ComponentClientChunkMap, context: EmitContext) => string;

const clientImports: EmitStep = (info, context) => {
  return Object.entries(info)
    .map(([name, entry]) => {
      const filePath = entry.paths.client;
      const varName = context.vars.client[name];

      return `import ${varName} from '${pathToFileURL(filePath)}';`;
    })
    .join('');
};

const componentInfoMap: EmitStep = (info, context) => {
  const mapEntries = Object.entries(info)
    .map(
      ([componentId, chunkEntry]) =>
        `${JSON.stringify(componentId)}: {
  renderer: () => import('${pathToFileURL(chunkEntry.paths.renderer)}'),
  client: ${context.vars.client[componentId]}
}`
    )
    .join(',');

  return `const map = {${mapEntries}}; export default map;`;
};

const steps = [clientImports, componentInfoMap];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  const nameGen = nameGenerator();

  const context: EmitContext = {
    vars: {
      client: Object.fromEntries(
        Object.entries(info)
          .map(([key, { paths }]) =>
            paths.client ? ([key, nameGen.create()] as const) : undefined
          )
          .filter((entry) => entry !== undefined)
      ),
    },
  };

  return steps.map((step) => step(info, context)).join('');
}
