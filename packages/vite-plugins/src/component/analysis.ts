import { parse } from 'espree';
import type { OutputChunk } from 'rollup';

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
