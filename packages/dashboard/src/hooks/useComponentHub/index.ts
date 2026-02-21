import { contextUseFactory } from '@game-cms/ui';

import { ComponentHubContext } from './context';

export * from './context';
export * from './provider';

export const useComponentHub = contextUseFactory(
  ComponentHubContext,
  'ComponentHubContext'
);
