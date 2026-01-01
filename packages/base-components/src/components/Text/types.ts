import { ComponentEntry } from '@game-cms/types';

export type TextOptions = {
  minLength?: number;
  maxLength?: number;
};

export type TextData = string;

export type TextError = 'TEXT_TOO_SHORT' | 'TEXT_TOO_LONG';

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::text': ComponentEntry<{
      rawData: TextData;
      options: TextOptions;
      error: TextError;
    }>;
  }
}
