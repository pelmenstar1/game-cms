import { ComponentEntry } from '@game-cms/core';
import { TextSearchIndex } from '@game-cms/shared/search';

export const id = 'base::text' as const;
export type Id = typeof id;

export type TextOptions = {
  minLength?: number;
  maxLength?: number;
};

export type TextData = string;

export type TextError = 'INVALID_TYPE' | 'TEXT_TOO_SHORT' | 'TEXT_TOO_LONG';

export type { TextSearchIndex } from '@game-cms/shared/search';

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<{
      outData: TextData;
      options: TextOptions;
      error: TextError;
      searchIndexData: TextSearchIndex;
    }>;
  }
}
