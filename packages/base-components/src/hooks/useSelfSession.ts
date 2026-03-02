import { contextUseFactory } from '@game-cms/ui';

import { SessionContext } from '../context/SessionContext.js';

export const useSelfSession = contextUseFactory(
  SessionContext,
  'SessionContext'
);
