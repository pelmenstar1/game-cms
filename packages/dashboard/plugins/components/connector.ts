import { pathToFileURL } from 'node:url';

import { sanitizeId } from '@game-cms/shared/string';

import type {
  ComponentClientChunkEntry,
  ComponentClientChunkMap,
} from './gather.js';

type EmitStep = (info: ComponentClientChunkMap) => string;

function coreImportName(componentId: string) {
  return `${sanitizeId(componentId)}_shared`;
}

function clientImportName(componentId: string) {
  return `${sanitizeId(componentId)}_client`;
}

function emitImportBase(
  filePathKey: keyof ComponentClientChunkEntry['paths'],
  nameFactory: (value: string) => string
): EmitStep {
  return (info) =>
    Object.entries(info)
      .map(([name, entry]) => {
        const filePath = entry.paths[filePathKey];

        if (filePath) {
          return `import ${nameFactory(name)} from '${pathToFileURL(filePath)}';`;
        }
      })
      .filter((value) => value !== undefined)
      .join('');
}

const coreImports = emitImportBase('core', coreImportName);
const clientImports = emitImportBase(
  'client',
  (id) => `* as ${clientImportName(id)}`
);

const componentInfoMap: EmitStep = (info) => {
  const mapEntries = Object.entries(info)
    .map(
      ([componentId, { paths }]) =>
        `'${componentId}': {
  renderer: () => import('component-renderer:${componentId}'),
  core: ${coreImportName(componentId)},
  ${paths.client !== undefined ? `client: ${clientImportName(componentId)}` : ''}
}`
    )
    .join(',');

  return `const map = {${mapEntries}}; export default map;`;
};

const steps = [coreImports, clientImports, componentInfoMap];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  return steps.map((step) => step(info)).join('');
}
