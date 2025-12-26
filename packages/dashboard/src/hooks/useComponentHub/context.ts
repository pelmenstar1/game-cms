import type { ComponentApi, ForeignComponentContext } from '@game-cms/types';
import React from 'react';

export interface ComponentHub {
  loaded: boolean;
  api: ComponentApi;
  validationContext: ForeignComponentContext['validation'];
}

export const ComponentHubContext = React.createContext<ComponentHub | null>(
  null
);
