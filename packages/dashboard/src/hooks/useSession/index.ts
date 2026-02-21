import { contextUseFactory } from '@game-cms/ui';

import { SessionContext } from './context';

export * from './context';
export * from './provider';

export const useSelfSession = contextUseFactory(
  SessionContext,
  'SessionContext'
);
