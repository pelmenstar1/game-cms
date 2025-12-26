import type { ForeignComponentContext } from '@game-cms/types';
import React from 'react';

export interface ComponentHub {
  validationContext: ForeignComponentContext['validation'];
}

export const ComponentHubContext = React.createContext<ComponentHub | null>(
  null
);
