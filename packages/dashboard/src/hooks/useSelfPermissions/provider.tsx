import { getSelfPermissions } from '@game-cms/client';
import { useApiQuery } from '@game-cms/component-api';
import { type PropsWithChildren, useMemo } from 'react';

import { PermissionsContext, type PermissionsContextType } from './context';

export function PermissionsProvider({ children }: PropsWithChildren) {
  const [permissions, refresh] = useApiQuery(getSelfPermissions);

  const context = useMemo(
    (): PermissionsContextType => ({
      refresh,
      permissions: new Set(
        permissions.status === 'success' ? permissions.value.permissions : []
      ),
    }),
    [refresh, permissions]
  );

  return (
    <PermissionsContext.Provider value={context}>
      {children}
    </PermissionsContext.Provider>
  );
}
