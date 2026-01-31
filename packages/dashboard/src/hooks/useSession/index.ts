import { createContextHook } from '@game-cms/ui';

import { SessionContext } from './context';
import { SessionProvider } from './provider';

export const useSelfSession = createContextHook(
  SessionContext,
  SessionProvider
);
