import type { ApiRouteId } from '@game-cms/core/api';
import { useTypedNavigate } from '@game-cms/ui';
import { useEffect } from 'react';

import { useSelfPermissions } from './useSelfPermissions';

export function useCheckPermissions(id: ApiRouteId) {
  const { permissions } = useSelfPermissions();
  const redirect = useTypedNavigate();

  useEffect(() => {
    if (!permissions.has(id)) {
      console.log(permissions);
      void redirect('/404');
    }
  }, [id, permissions, redirect]);
}
