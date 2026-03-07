import { isNonNullObject } from '@game-cms/shared';
import { importFile } from '@game-cms/shared/node';

export async function getComponentIdFromCoreFile(filePath: string) {
  function expected(message: string): never {
    throw new Error(`Expected ${message} in component core file: ${filePath}`);
  }

  const moduleValue = await importFile(filePath);

  if (isNonNullObject(moduleValue)) {
    const defaultExport = moduleValue.default;

    if (isNonNullObject(defaultExport)) {
      const { id } = defaultExport;

      if (typeof id === 'string') {
        return id;
      }

      expected("a string 'id' property");
    }

    expected('a default object export');
  }

  throw new Error('Unexpected module value');
}
