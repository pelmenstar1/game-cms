export type CompiledFileName =
  | 'routes'
  | 'components'
  | 'entities'
  | 'services'
  | 'cms.config.js';

export function compiledFilePath(name: CompiledFileName) {
  return `./dist/${name}`;
}
