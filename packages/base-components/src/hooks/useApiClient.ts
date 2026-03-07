import { contextUseFactory } from '@game-cms/ui';

import { ApiClientContext } from '../context/ApiClientContext.js';

export const useApiClient = contextUseFactory(
  ApiClientContext,
  'ApiClientContext'
);
