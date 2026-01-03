import type { ForeignComponentValidationContext } from '@game-cms/core';
import React from 'react';

export interface ComponentHub {
  validationContext: ForeignComponentValidationContext;
}

export const ComponentHubContext = React.createContext<ComponentHub | null>(
  null
);
