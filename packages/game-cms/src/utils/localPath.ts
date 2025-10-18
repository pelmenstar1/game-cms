export type CompiledFolderName =
  | 'config'
  | 'routes'
  | 'components'
  | 'services';

export function compiledDirectoryPath(name: CompiledFolderName) {
  return `./dist/${name}`;
}
