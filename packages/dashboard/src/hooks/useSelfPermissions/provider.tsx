import { getSelfPermissions } from '@game-cms/client';
import { useApiQuery } from '@game-cms/component-api';
import { type PropsWithChildren, useMemo } from 'react';

import { PermissionsContext, type PermissionsContextType } from './context';

export function PermissionsProvider({ children }: PropsWithChildren) {
  const [permissions] = useApiQuery(getSelfPermissions);

  const context = useMemo(
    (): PermissionsContextType => ({
      permissions: new Set(
        permissions.status === 'success' ? permissions.value.permissions : []
      ),
    }),
    [permissions]
  );

  return (
    <PermissionsContext.Provider value={context}>
      {children}
    </PermissionsContext.Provider>
  );
}
