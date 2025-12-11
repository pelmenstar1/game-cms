import { createContextHook } from '../../utils/hookContext';
import { ApiClientContext } from './context';
import { ApiClientProvider } from './provider';

export const useApiClient = createContextHook(
  ApiClientContext,
  ApiClientProvider,
  (context) => context.client
);
