import { PropsWithChildren, useMemo } from 'react';

import {
  SessionContext,
  SessionContextType,
} from '../../src/context/SessionContext.js';

export function SessionProvider({ children }: PropsWithChildren) {
  const context = useMemo(
    (): SessionContextType => ({
      permissions: new Set(['storage/file$trace']),
      actorId: 'test',
      refresh: () => {},
    }),
    []
  );

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
}
