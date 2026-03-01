import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentInDataById,
  ComponentOutDataById,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

import { ComposeArgs } from './internal/options';

type ComposeId = 'base::compose';

type ThreeDModelEntry = {
  outData: ComponentOutDataById<ComposeId, ComposeArgs>;
  inData: ComponentInDataById<ComposeId, ComposeArgs>;
  options: Record<never, never>;
  error: ComponentErrorById<ComposeId, ComposeArgs>;
  clientData: ComponentClientDataById<ComposeId, ComposeArgs>;
  storageData: ComponentStorageDataById<ComposeId, ComposeArgs>;
  searchIndexData: ComponentSearchIndexDataById<ComposeId, ComposeArgs>;
};

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'game::three-d-model': ComponentEntry<ThreeDModelEntry>;
  }
}
