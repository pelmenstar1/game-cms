import { isNonNullObject } from '@game-cms/shared';
import { maybeImportFile } from '@game-cms/shared/node';

export async function getComponentIdFromClientFile(filePath: string) {
  function expected(message: string): never {
    throw new Error(
      `Expected ${message} in component client file: ${filePath}`
    );
  }

  const moduleValue = await maybeImportFile(filePath);
  if (moduleValue === undefined) {
    return null;
  }

  if (isNonNullObject(moduleValue)) {
    const defaultExport = moduleValue.default;

    if (isNonNullObject(defaultExport)) {
      const { core } = defaultExport;

      if (isNonNullObject(core) && typeof core.id === 'string') {
        return core.id;
      }

      expected("a string 'id' property");
    }

    expected('a default object export');
  }

  throw new Error('Unexpected module value');
}
