import path from 'node:path';

import { type CompilerOptions, ModuleResolutionKind } from 'typescript';

import { readJson5 } from './json.js';

export type TsConfig = {
  extends?: string;
  references?: { path: string }[];
  compilerOptions?: CompilerOptions;
};

export function readTsConfig(dirPath: string): Promise<TsConfig> {
  return readJson5<TsConfig>(path.join(dirPath, 'tsconfig.json'));
}

export async function getPackageModuleResolution(
  dirPath: string
): Promise<ModuleResolutionKind> {
  const originTsConfig = await readTsConfig(dirPath);
  const moduleResolution = originTsConfig.compilerOptions?.moduleResolution;

  if (moduleResolution !== undefined) {
    return moduleResolution;
  }

  if (originTsConfig.extends) {
    const extendedConfigPath = path.join(dirPath, originTsConfig.extends);

    return getPackageModuleResolution(extendedConfigPath);
  }

  return ModuleResolutionKind.NodeNext;
}
