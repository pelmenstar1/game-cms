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

function metaImportName(componentId: string) {
  return `${sanitizeId(componentId)}_meta`;
}

function validatorImportName(componentId: string) {
  return `${sanitizeId(componentId)}_validator`;
}

function clientResolverImportName(componentId: string) {
  return `${sanitizeId(componentId)}_clientResolver`;
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

const metaImports = emitImportBase(metaImportName, (paths) => paths.meta);
const validatorImports = emitImportBase(
  (id) => `{ validator as ${validatorImportName(id)} }`,
  (paths) => paths.validator
);
const clientResolverImports = emitImportBase(
  (id) => `{ clientResolver as ${clientResolverImportName(id)} }`,
  (paths) => paths.clientResolver
);

const helperImports: EmitStep = () =>
  `import { resolveMaybeFactory } from '@game-cms/shared';`;

const componentInfoMap: EmitStep = (info) => {
  const mapEntries = Object.entries(info)
    .map(
      ([componentId, entry]) =>
        `'${componentId}': {
  component: () => import('${normalizeFilePath(entry.paths.main)}'),
  meta: ${metaImportName(componentId)},
  validator: ${validatorImportName(componentId)},
  ${entry.paths.clientResolver !== undefined ? `clientResolver: ${clientResolverImportName(componentId)}` : ''}
}`
    )
    .join(',');

  return `const componentInfoMap = {${mapEntries}};`;
};

const connectorSteps: Record<keyof ComponentConnector, EmitStep> = {
  importComponent: () => {
    return `(id) => componentInfoMap[id].component();`;
  },
  getComponentDefaultData: () => {
    return `(id, options, context) => resolveMaybeFactory(componentInfoMap[id].meta.defaultRawData, options, context);`;
  },
  getComponentValidator: () => {
    return `(id) => componentInfoMap[id].validator;`;
  },
  getComponentConfig: () => {
    return `(id) => componentInfoMap[id].meta.config;`;
  },
  getComponentClientResolver: () => {
    return `(id) => componentInfoMap[id].clientResolver;`;
  },
};

const steps = [
  metaImports,
  validatorImports,
  clientResolverImports,
  helperImports,
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
