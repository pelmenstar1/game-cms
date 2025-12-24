import type {
  ComponentClientChunkEntry,
  ComponentClientChunkMap,
} from './gather.js';

function emitGetComponentsIds(info: ComponentClientChunkMap) {
  const componentIds = Object.keys(info);
  const array = componentIds.map((id) => `"${id}"`);

  return `export const getComponentIds = () => [${array}];`;
}

function getClientBundlePath(entry: ComponentClientChunkEntry) {
  return `file://${entry.client.replaceAll('\\', '\\\\')}`;
}

function emitImportComponent(info: ComponentClientChunkMap) {
  const mapEntries = Object.entries(info)
    .map(
      ([key, entry]) =>
        `'${key}': () => import('${getClientBundlePath(entry)}')`
    )
    .join(',');

  return `export const importMap = {${mapEntries}}; export const importComponent = (id) => importMap[id]();`;
}

function emitGetComponentDefaultData(info: ComponentClientChunkMap) {
  const mapEntries = Object.entries(info)
    .map(([key, entry]) => `'${key}': ${JSON.stringify(entry.defaultData)}`)
    .join(',');

  return `export const defaultDataMap = {${mapEntries}}; export const getComponentDefaultData = (id) => defaultDataMap[id];`;
}

export function emitComponentConnector(info: ComponentClientChunkMap) {
  let result = emitGetComponentsIds(info);
  result += emitImportComponent(info);
  result += emitGetComponentDefaultData(info);

  return result;
}
