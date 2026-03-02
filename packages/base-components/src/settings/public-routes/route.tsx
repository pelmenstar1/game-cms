import {
  getPublicPermissions,
  updatePublicPermissions,
} from '@game-cms/base-api/client';
import { useSelfSession } from '@game-cms/base-components/micro';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import type { ApiRouteId } from '@game-cms/core/api';
import {
  Button,
  DataLoader,
  useAsyncCallback,
  useNotification,
  WarningBlock,
} from '@game-cms/ui';
import { useLayoutEffect, useState } from 'react';

import { useCheckPermissions } from '../../hooks/useCheckPermissions.js';
import { PermissionsEditor } from '../../micro/PermissionsEditor/index.js';
import styles from './route.module.scss';

export default function Page() {
  const [permissionsResult] = useApiQuery(getPublicPermissions);

  const [selectedPermissions, setSelectedPermissions] = useState<ApiRouteId[]>(
    []
  );

  const notification = useNotification();
  const doUpdatePermissions = useApiAction(updatePublicPermissions);
  const { permissions: selfPermissions } = useSelfSession();

  const canUpdate = selfPermissions.has('auth/permissions/public$update');

  useCheckPermissions('auth/permissions/public$get');

  useLayoutEffect(() => {
    if (permissionsResult.status === 'success') {
      setSelectedPermissions(permissionsResult.value.permissions);
    }
  }, [permissionsResult]);

  const onUpdate = useAsyncCallback(async () => {
    try {
      await doUpdatePermissions({ permissions: selectedPermissions });

      notification.info('Public permissions updated successfully');
    } catch (error) {
      console.error(error);

      notification.error('Failed to update public permissions');
    }
  }, [doUpdatePermissions, notification, selectedPermissions]);

  return (
    <div className={styles['content']}>
      <WarningBlock className={styles['warning']}>
        This API routes will be available without authorization
      </WarningBlock>

      <DataLoader
        result={permissionsResult}
        className={styles['content-inner']}
      >
        {() => (
          <>
            <PermissionsEditor
              selectedPermissions={selectedPermissions}
              onPermissionsSelected={setSelectedPermissions}
              readOnly={!canUpdate}
            />

            {canUpdate && (
              <Button
                className={styles.update}
                onClick={onUpdate}
                buttonVariant="solid"
              >
                Update
              </Button>
            )}
          </>
        )}
      </DataLoader>
    </div>
  );
}
