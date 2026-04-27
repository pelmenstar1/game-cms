import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentInDataById,
  ComponentOutDataById,
  ComponentResolvedDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

import { ComposeId } from '../../types/compose.js';
import { ComposeArgs } from './internal/options.js';

export const id = 'game::sprite-stripe' as const;
export type Id = typeof id;

type SpriteStripeEntry = {
  outData: ComponentOutDataById<ComposeId, ComposeArgs>;
  inData: ComponentInDataById<ComposeId, ComposeArgs>;
  options: {
    supportedMimeTypes?: string[];
  };
  error: ComponentErrorById<ComposeId, ComposeArgs>;
  clientData: ComponentClientDataById<ComposeId, ComposeArgs>;
  storageData: ComponentStorageDataById<ComposeId, ComposeArgs>;
  searchIndexData: ComponentSearchIndexDataById<ComposeId, ComposeArgs>;
  resolvedData: ComponentResolvedDataById<ComposeId, ComposeArgs>;
  isContainer: true;
};

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<SpriteStripeEntry>;
  }
}
