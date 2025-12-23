import type { ComponentApi, ForeignComponentContext } from '@game-cms/types';
import React from 'react';

export interface ComponentHub {
  loaded: boolean;
  api: ComponentApi;
  validationContext: Pick<ForeignComponentContext, 'validation'>;
}

export const ComponentHubContext = React.createContext<ComponentHub | null>(
  null
);
