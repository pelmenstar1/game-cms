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

function emitImportBase(
  nameFactory: (value: string) => string,
  filePathFactory: (entry: ComponentClientChunkEntry) => string
): EmitStep {
  return (info) =>
    Object.entries(info)
      .map(
        ([name, entry]) =>
          `import ${nameFactory(name)} from '${normalizeFilePath(filePathFactory(entry))}';`
      )
      .join('');
}

const metaImports = emitImportBase(
  metaImportName,
  (entry) => entry.metaFilePath
);

const validatorImports = emitImportBase(
  (id) => `{ validator as ${validatorImportName(id)} }`,
  (entry) => entry.validatorFilePath
);

const helperImports: EmitStep = () =>
  `import { resolveMaybeFactory } from '@game-cms/shared';`;

const importComponent: EmitStep = (info) => {
  const mapEntries = Object.entries(info)
    .map(
      ([componentId, entry]) =>
        `'${componentId}': () => import('${normalizeFilePath(entry.mainFilePath)}')`
    )
    .join(',');

  return `const importMap = {${mapEntries}}; export const importComponent = (id) => importMap[id]();`;
};

const getComponentIds: EmitStep = () =>
  `export const getComponentIds = () => Object.keys(importMap);`;

const getComponentDefaultData: EmitStep = (info) => {
  const mapEntries = Object.keys(info)
    .map((componentId) => `'${componentId}': ${metaImportName(componentId)}`)
    .join(',');

  return `const metaMap = {${mapEntries}};
  export const getComponentDefaultData = (id, options) => 
    resolveMaybeFactory(metaMap[id], options);`;
};

const getComponentValidator: EmitStep = (info) => {
  const mapEntries = Object.keys(info)
    .map(
      (componentId) => `'${componentId}': ${validatorImportName(componentId)}`
    )
    .join(',');

  return `const validatorMap = {${mapEntries}}; export const getComponentValidator = (id) => validatorMap[id];`;
};

const steps = [
  metaImports,
  validatorImports,
  helperImports,
  getComponentDefaultData,
  importComponent,
  getComponentValidator,
  getComponentIds,
];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  return steps.map((step) => step(info)).join('');
}
