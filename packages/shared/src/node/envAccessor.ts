import fsp from 'node:fs/promises';

import { importPKCS8 } from 'jose';

type EnvForType<T> = (name: string, defaultValue?: T) => T;

type Transformer<T> = (input: string, varName: string) => T;

export interface EnvAccessor extends EnvForType<string> {
  int: EnvForType<number>;
  float: EnvForType<number>;
  bool: EnvForType<boolean>;
  pemFile: (filePath: string, alg: string) => Promise<CryptoKey>;
}

function createEnvForType<T>(transform: Transformer<T>): EnvForType<T> {
  const result = (name: string, defaultValue: T | undefined) => {
    const value = process.env[name];
    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Environment variable ${name} does not exist`);
      }

      return defaultValue;
    }

    return transform(value, name);
  };

  return result;
}

function throwInvalidFormat(name: string): never {
  throw new Error(`Environment variable ${name} has invalid format`);
}

function forbidNaN(func: (input: string) => number): Transformer<number> {
  return (input, varName) => {
    const result = func(input);
    if (Number.isNaN(result)) {
      throwInvalidFormat(varName);
    }

    return result;
  };
}

export function createEnvAccessor(): EnvAccessor {
  const result = createEnvForType((value) => value) as EnvAccessor;
  result.int = createEnvForType(forbidNaN(Number.parseInt));
  result.float = createEnvForType(forbidNaN(Number.parseFloat));
  result.bool = createEnvForType((input, varName) => {
    switch (input) {
      case 'true':
      case '1': {
        return true;
      }
      case 'false':
      case '0': {
        return false;
      }
      default: {
        throwInvalidFormat(varName);
      }
    }
  });

  result.pemFile = async (filePath, alg) => {
    const content = await fsp.readFile(filePath, 'utf8');

    return importPKCS8(content, alg);
  };

  return result;
}
