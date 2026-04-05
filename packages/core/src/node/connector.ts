import { pathToFileURL } from 'node:url';

import { nameGenerator } from '@game-cms/shared';

import { ComponentBuildMeta } from '../component/build.js';
import { ComponentRendererVariant } from '../component/client/renderer.js';
import type { ComponentClientChunkMap } from './gather.js';

interface EmitContext {
  vars: { client: Record<string, string> };
}

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
  const mapEntries = Object.entries(info).map(([componentId, chunkEntry]) => {
    const rendererEntries = Object.entries(chunkEntry.paths.renderers);
    const meta: ComponentBuildMeta = {
      renderers: rendererEntries.map(
        ([key]) => key
      ) as ComponentRendererVariant[],
    };

    const rendererImports = rendererEntries.map(([variant, filePath]) => {
      const importDecl = `() => import('${pathToFileURL(filePath)}')`;

      return `${JSON.stringify(variant)}: ${importDecl}`;
    });

    return `${JSON.stringify(componentId)}: {
  renderers: {${rendererImports.join(',')}},
  client: ${context.vars.client[componentId]},
  meta: ${JSON.stringify(meta)},
}`;
  });

  return `const map = {${mapEntries.join(',')}}; export default map;`;
};

const steps = [clientImports, componentInfoMap];

export function emitComponentConnector(info: ComponentClientChunkMap) {
  const nameGen = nameGenerator();

  const emitContext: EmitContext = {
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

  return steps.map((step) => step(info, emitContext)).join('');
}
