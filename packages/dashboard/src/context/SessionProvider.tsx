import { getSelfSessionInfo } from '@game-cms/base-api/client';
import {
  SessionContext,
  SessionContextType,
  useApiQuery,
} from '@game-cms/base-components/shared';
import { ApiRouteId } from '@game-cms/core/api';
import { type PropsWithChildren, useMemo } from 'react';

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, refresh] = useApiQuery(getSelfSessionInfo);

  const context = useMemo((): SessionContextType => {
    let actorId: string | undefined;
    let permissions: Set<ApiRouteId>;

    if (session.status === 'success') {
      actorId = session.value.actorId;
      permissions = new Set(session.value.permissions);
    } else {
      permissions = new Set();
    }

    return {
      refresh,
      actorId,
      permissions,
    };
  }, [refresh, session]);

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
}
