import type { ApiRouteId } from '@game-cms/core/api';
import { useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

import { useSelfSession } from './useSession';

export function useCheckPermissions(id: ApiRouteId) {
  const { permissions } = useSelfSession();
  const redirect = useTypedNavigate();

  useEffect(() => {
    if (!permissions.has(id) && !import.meta.env.DEV) {
      void redirect('/404');
    }
  }, [id, permissions, redirect]);
}
