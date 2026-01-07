import type {
  ComponentClientChunkEntry,
  ComponentClientChunkMap,
} from './gather.js';

type EmitStep = (info: ComponentClientChunkMap) => string;

function normalizeFilePath(value: string) {
  return `file://${value.replaceAll('\\', '/')}`;
}

function sanitizeId(componentId: string) {
  return componentId.replaceAll(/[^\w\d]/g, '_');
}

function sharedImportName(componentId: string) {
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
          return `import * as ${nameFactory(name)} from '${normalizeFilePath(filePath)}';`;
        }
      })
      .filter((value) => value !== undefined)
      .join('');
}

const sharedImports = emitImportBase('shared', sharedImportName);
const clientImports = emitImportBase('client', clientImportName);

const componentInfoMap: EmitStep = (info) => {
  const mapEntries = Object.entries(info)
    .map(
      ([componentId, entry]) =>
        `'${componentId}': {
  renderer: () => import('${normalizeFilePath(entry.paths.renderer)}'),
  shared: ${sharedImportName(componentId)},
  ${entry.paths.client !== undefined ? `client: ${clientImportName(componentId)}` : ''}
}`
    )
    .join(',');

  return `const map = {${mapEntries}}; export default map;`;
};

const steps = [sharedImports, clientImports, componentInfoMap];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  return steps.map((step) => step(info)).join('');
}
