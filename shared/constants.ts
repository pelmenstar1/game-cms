import path from 'node:path';

export const workspaceRoot = path.join(import.meta.dirname, '../');
export const packagesDir = path.join(workspaceRoot, 'packages');

export const tsConfigImplicitDependencies: Partial<Record<string, string[]>> = {
  'game-cms': ['../dashboard/tsconfig.lib.json'],
};
