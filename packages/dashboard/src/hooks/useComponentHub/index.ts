import { createContextHook } from '@game-cms/ui';

import { ComponentHubContext } from './context';
import { ComponentHubProvider } from './provider';

export const useComponentHub = createContextHook(
  ComponentHubContext,
  ComponentHubProvider
);
