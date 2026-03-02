import { pathToFileURL } from 'node:url';

import { nameGenerator } from '@game-cms/shared';

import type { ComponentClientChunkMap } from './gather.js';

type EmitContext = {
  vars: Record<'core' | 'client', Record<string, string>>;
};

type EmitStep = (info: ComponentClientChunkMap, context: EmitContext) => string;

function emitImportBase(
  filePathKey: 'core' | 'client',
  transformName?: (value: string) => string
): EmitStep {
  return (info, context) =>
    Object.entries(info)
      .map(([name, entry]) => {
        const filePath = entry.paths[filePathKey];

        if (filePath) {
          const varName = context.vars[filePathKey][name];
          const importVar = transformName ? transformName(varName) : varName;

          return `import ${importVar} from '${pathToFileURL(filePath)}';`;
        }
      })
      .filter((value) => value !== undefined)
      .join('');
}

const coreImports = emitImportBase('core');
const clientImports = emitImportBase('client', (id) => `* as ${id}`);

const componentInfoMap: EmitStep = (info, context) => {
  const mapEntries = Object.entries(info)
    .map(
      ([componentId, { paths }]) =>
        `'${componentId}': {
  renderer: () => import('component-renderer:${componentId}'),
  core: ${context.vars.core[componentId]},
  ${paths.client !== undefined ? `client: ${context.vars.client[componentId]}` : ''}
}`
    )
    .join(',');

  return `const map = {${mapEntries}}; export default map;`;
};

const steps = [coreImports, clientImports, componentInfoMap];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  const nameGen = nameGenerator();
  const context: EmitContext = {
    vars: {
      core: Object.fromEntries(
        Object.keys(info).map((key) => [key, nameGen.create()] as const)
      ),
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
