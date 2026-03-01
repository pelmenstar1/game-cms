import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentInDataById,
  ComponentOutDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

import { FontFormat } from './internal/format.js';
import { RepeatableArgs } from './internal/repeatable.js';

type FileId = 'base::file';

export type FontStyle = 'normal' | 'italic';

type FontDataItem<Source extends unknown[]> = {
  file: Source;
  weight: number;
  style: FontStyle;
};

type FontData<Source extends unknown[]> = FontDataItem<Source>[];

type FontEntry = {
  outData: FontData<ComponentOutDataById<FileId>>;
  inData: FontData<ComponentInDataById<FileId>>;
  options: {
    supportedFormats?: FontFormat[];
  };
  error: ComponentErrorById<'base::repeatable', RepeatableArgs>;
  clientData: ComponentClientDataById<'base::repeatable', RepeatableArgs>;
  storageData: FontData<ComponentStorageDataById<FileId>>;
  searchIndexData: ComponentSearchIndexDataById<FileId>;
};

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::font': ComponentEntry<FontEntry>;
  }
}
