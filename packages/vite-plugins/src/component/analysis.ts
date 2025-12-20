import { filterOutNullable } from '@game-cms/shared/collections';
import type { ComponentRendererDependencies } from '@game-cms/types';
import { parse } from 'espree';
import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup';

import { minifyCode } from './utils.js';

export function getComponentIdFromMetaChunk(chunk: OutputChunk) {
  const { body } = parse(chunk.code, {
    sourceType: 'module',
    ecmaVersion: 'latest',
  });

  const exportNode = body.find(
    (node) => node.type === 'ExportNamedDeclaration'
  );

  const idSpecifier = exportNode?.specifiers.find(
    ({ exported }) => exported.type === 'Identifier' && exported.name === 'id'
  )?.local;

  switch (idSpecifier?.type) {
    case 'Literal': {
      const { value } = idSpecifier;

      if (typeof value === 'string') {
        return value;
      }

      throw new Error(`Invalid meta file: 'id' is not a string`);
    }
    case 'Identifier': {
      const varDecl = body.find((node) => node.type === 'VariableDeclaration');

      if (varDecl) {
        const idDecl = varDecl.declarations.find(
          (decl) =>
            decl.id.type === 'Identifier' && decl.id.name === idSpecifier.name
        );

        if (idDecl) {
          const { init } = idDecl;

          if (init?.type === 'Literal' && typeof init.value === 'string') {
            return init.value;
          }
        }
      }
    }
  }

  throw new Error(`Invalid meta file: no 'id' export`);
}

function trackAllJsDependencies(
  bundle: OutputBundle,
  chunk: OutputChunk | OutputAsset
): OutputChunk[] {
  if (chunk.type !== 'chunk') {
    return [];
  }

  return chunk.imports.flatMap((importChunkId) => {
    const chunk = bundle[importChunkId];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (chunk?.type === 'chunk') {
      return [chunk, ...trackAllJsDependencies(bundle, chunk)];
    }

    return [];
  });
}

function getCssDependencies(bundle: OutputBundle, chunk: OutputChunk) {
  const { viteMetadata } = chunk as {
    viteMetadata?: { importedCss: Set<string> };
  };

  if (viteMetadata) {
    const importedCss = [...viteMetadata.importedCss];

    return filterOutNullable(
      importedCss.map((chunkId) => {
        const cssChunk = bundle[chunkId];

        if (cssChunk.type === 'asset') {
          return { id: chunkId, code: String(cssChunk.source) };
        }
      })
    );
  }

  return [];
}

export async function trackRendererDependencies(
  bundle: OutputBundle,
  rendererChunk: OutputChunk
): Promise<ComponentRendererDependencies> {
  const js = trackAllJsDependencies(bundle, rendererChunk);
  const css = [...js, rendererChunk].flatMap((chunk) =>
    getCssDependencies(bundle, chunk)
  );

  const jsEntries = await Promise.all(
    js.map(
      async (chunk) => [chunk.fileName, await minifyCode(chunk.code)] as const
    )
  );

  return {
    css: Object.fromEntries(css.map(({ id, code }) => [id, code])),
    js: Object.fromEntries(jsEntries),
  };
}
