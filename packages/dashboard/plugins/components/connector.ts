import type { ComponentConnector } from '@/types/componentConnector.js';

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
  nameFactory: (value: string) => string,
  filePathFactory: (
    paths: ComponentClientChunkEntry['paths']
  ) => string | undefined
): EmitStep {
  return (info) =>
    Object.entries(info)
      .map(([name, entry]) => {
        const filePath = filePathFactory(entry.paths);

        if (filePath) {
          return `import ${nameFactory(name)} from '${normalizeFilePath(filePath)}';`;
        }
      })
      .filter((value) => value !== undefined)
      .join('');
}

const sharedImports = emitImportBase(
  (id) => `* as ${sharedImportName(id)}`,
  (paths) => paths.shared
);

const clientImports = emitImportBase(
  (id) => `* as ${clientImportName(id)}`,
  (paths) => paths.client
);

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

  return `const componentInfoMap = {${mapEntries}};`;
};

const connectorSteps: Record<keyof ComponentConnector, EmitStep> = {
  importComponent: () => {
    return `(id) => componentInfoMap[id].renderer();`;
  },
  getComponentDefaultData: () => {
    return `(id, options, context) => componentInfoMap[id].shared.defaultRawData(options, context);`;
  },
  getComponentValidator: () => {
    return `(id) => componentInfoMap[id].shared.validator;`;
  },
  getComponentConfig: () => {
    return `(id) => componentInfoMap[id].shared.meta.config;`;
  },
  getComponentClientTransformer: () => {
    return `(id) => componentInfoMap[id].client.clientTransformer;`;
  },
};

const steps = [
  sharedImports,
  clientImports,
  componentInfoMap,
  ...Object.entries(connectorSteps).map(
    ([key, step]) =>
      (info: ComponentClientChunkMap) =>
        `export const ${key} = ${step(info)}`
  ),
];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  return steps.map((step) => step(info)).join('');
}
