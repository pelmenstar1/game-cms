import fsp from 'node:fs/promises';
import path from 'node:path';

import { EntityId } from '@game-cms/base-core';
import {
  AST_NODE_TYPES,
  parse as estreeParse,
} from '@typescript-eslint/typescript-estree';

type Statement = ReturnType<typeof estreeParse>['body'][number];
type ExportNamedDeclarationWithSource = Extract<
  Statement,
  { type: typeof AST_NODE_TYPES.ExportNamedDeclaration }
>;

function normalizeFilePath(filePath: string, registryPath: string) {
  return path.join(
    path.dirname(registryPath),
    filePath.replace(/\.js$/, '.ts')
  );
}

function getExportedId(declaration: ExportNamedDeclarationWithSource) {
  const { specifiers } = declaration;

  if (specifiers.length === 1) {
    const [{ exported, local }] = specifiers;

    if (
      local.type === AST_NODE_TYPES.Identifier &&
      local.name === 'default' &&
      exported.type === AST_NODE_TYPES.Identifier
    ) {
      return exported.name;
    }
  }
}

export async function getReExportedSchemaPaths(registryPath: string) {
  const result: Partial<Record<EntityId, { filePath: string }>> = {};

  const registryContent = await fsp.readFile(registryPath, 'utf8');
  const ast = estreeParse(registryContent);

  for (const declaration of ast.body) {
    if (
      declaration.type === AST_NODE_TYPES.ExportNamedDeclaration &&
      declaration.source
    ) {
      const id = getExportedId(declaration);
      const filePath = normalizeFilePath(
        declaration.source.value,
        registryPath
      );

      if (id) {
        result[id] = { filePath };
      }
    }
  }

  return result;
}
