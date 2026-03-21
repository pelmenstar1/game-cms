import path from 'node:path';

export const packagesDir = path.join(import.meta.dirname, '../packages');

export const tsConfigImplicitDependencies: Partial<Record<string, string[]>> = {
  'game-cms': ['../dashboard/tsconfig.lib.json'],
};
