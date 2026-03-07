import { createUser } from '@game-cms/base-api/client';
import type { CreateUserPayload } from '@game-cms/base-core';
import { useNotification, usePreventLeaving } from '@game-cms/ui';
import { useCallback } from 'react';

import { useApiAction } from '../../../hooks/useApiAction.js';
import { useCheckPermissions } from '../../../hooks/useCheckPermissions.js';
import { AccessUserView } from '../../../micro/AccessUserView/index.js';

export default function Page() {
  const doCreateUser = useApiAction(createUser);
  const notification = useNotification();

  useCheckPermissions('user$create');

  usePreventLeaving();

  const onCreate = useCallback(
    (payload: CreateUserPayload) => {
      doCreateUser(payload).catch(() => {
        notification.error('Failed to create user');
      });
    },
    [doCreateUser, notification]
  );

  return <AccessUserView onAction={onCreate} />;
}
