import { ComponentEntry } from '@game-cms/types';

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::number': ComponentEntry<{
      data: number;
      options: Record<string, never>;
      error: undefined;
    }>;
  }
}
