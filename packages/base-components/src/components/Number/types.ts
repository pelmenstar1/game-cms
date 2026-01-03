import { ComponentEntry } from '@game-cms/core';

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::number': ComponentEntry<{
      rawData: number;
      options: Record<string, never>;
      error: undefined;
    }>;
  }
}
