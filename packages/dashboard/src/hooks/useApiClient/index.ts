import { createContextHook } from '@game-cms/ui';

import { ApiClientContext } from './context';
import { ApiClientProvider } from './provider';

export const useApiClient = createContextHook(
  ApiClientContext,
  ApiClientProvider,
  (context) => context.client
);
