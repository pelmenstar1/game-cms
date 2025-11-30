import type {
  ComponentBuildStaticConfig,
  ComponentBuildStaticConfigMap,
} from './bundle.js';

function getMapEntry(id: string, value: ComponentBuildStaticConfig) {
  const controllerImportId = id.replaceAll(/[^a-z]/gi, '_');
  const renderManifest = JSON.stringify(value.renderManifest);

  return {
    controller: {
      id: controllerImportId,
      filePath: value.controller.filePath,
    },
    entry: `"${id}": { controller: ${controllerImportId}, renderManifest: ${renderManifest} }`,
  };
}

export function getComponentSourceFile(
  map: ComponentBuildStaticConfigMap
): string {
  const entries = Object.entries(map).map(([id, value]) =>
    getMapEntry(id, value)
  );

  const imports = entries
    .map(
      ({ controller }) =>
        `import ${controller.id} from './${controller.filePath}'`
    )
    .join(';');

  const mapContent = entries.map(({ entry }) => entry).join(',');

  return `${imports}; const map = {${mapContent}}; export default map;`;
}
