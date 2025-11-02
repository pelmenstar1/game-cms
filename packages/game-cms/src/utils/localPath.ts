export type CompiledFolderName =
  | 'config'
  | 'routes'
  | 'components'
  | 'entities'
  | 'services';

export function compiledDirectoryPath(name: CompiledFolderName) {
  return `./dist/${name}`;
}
