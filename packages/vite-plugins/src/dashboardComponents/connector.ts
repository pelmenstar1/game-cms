import type { ComponentClientChunkMap } from './gather.js';

function filePath(value: string) {
  return `file://${value.replaceAll('\\', '/')}`;
}

function metaImportName(componentId: string) {
  const sanitizedId = componentId.replaceAll(/[^\w\d]/g, '_');

  return `${sanitizedId}_meta`;
}

function emitHelperImports() {
  return `import { resolveMaybeFactory } from '@game-cms/shared';`;
}

function emitMetaImports(info: ComponentClientChunkMap) {
  return Object.entries(info)
    .map(
      ([componentId, entry]) =>
        `import ${metaImportName(componentId)} from '${filePath(entry.metaFilePath)}';`
    )
    .join('');
}

function emitGetComponentsIds(info: ComponentClientChunkMap) {
  const componentIds = Object.keys(info);
  const array = componentIds.map((id) => `"${id}"`);

  return `export const getComponentIds = () => [${array}];`;
}

function emitImportComponent(info: ComponentClientChunkMap) {
  const mapEntries = Object.entries(info)
    .map(
      ([key, entry]) => `'${key}': () => import('${filePath(entry.client)}')`
    )
    .join(',');

  return `const importMap = {${mapEntries}}; export const importComponent = (id) => importMap[id]();`;
}

function emitGetComponentDefaultData(info: ComponentClientChunkMap) {
  const mapEntries = Object.entries(info)
    .map(([componentId]) => `'${componentId}': ${metaImportName(componentId)}`)
    .join(',');

  return `const metaMap = {${mapEntries}};
  export const getComponentDefaultData = (id, options) => 
    resolveMaybeFactory(metaMap[id], options)`;
}

export function emitComponentConnector(info: ComponentClientChunkMap) {
  let result = emitMetaImports(info);
  result += emitHelperImports();
  result += emitGetComponentsIds(info);
  result += emitImportComponent(info);
  result += emitGetComponentDefaultData(info);

  return result;
}
