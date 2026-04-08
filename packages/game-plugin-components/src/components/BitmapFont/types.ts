import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentInDataById,
  ComponentOutDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

import { ComposeId } from '../../types/compose';
import { ComposeArgs } from './internal/options';

export const id = 'game::bitmap-font' as const;
export type Id = typeof id;

type BitmapFontEntry = {
  outData: ComponentOutDataById<ComposeId, ComposeArgs> & {
    originalAtlas?: ComponentOutDataById<'base::file'>[number];
  };
  inData: ComponentInDataById<ComposeId, ComposeArgs>;
  options: Record<never, never>;
  error: ComponentErrorById<ComposeId, ComposeArgs>;
  clientData: ComponentClientDataById<ComposeId, ComposeArgs>;
  storageData: {
    pages: ComponentStorageDataById<'base::file'>;
    atlas: ComponentStorageDataById<'base::file'>;
    shadowAtlas?: ComponentStorageDataById<'base::file'>[number];
  };
  searchIndexData: ComponentSearchIndexDataById<ComposeId, ComposeArgs>;
};

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<BitmapFontEntry>;
  }
}
