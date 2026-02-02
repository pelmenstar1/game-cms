import type { CreateUserPayload } from '@game-cms/base-core';
import { deleteUserById, getUserById, updateUserById } from '@game-cms/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import {
  Button,
  ConfirmationDialog,
  DataLoader,
  DeleteIcon,
  Toolbar,
  useAsyncCallback,
  useModal,
  useNotification,
  useTypedNavigate,
} from '@game-cms/ui';

import { AccessUserView } from '@/components/AccessUserView';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { useSelfSession } from '@/hooks/useSession';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const { id } = params;
  const [userResult] = useApiQuery(getUserById, [id]);

  const showModal = useModal();
  const redirect = useTypedNavigate();
  const notification = useNotification();

  const doUpdateUser = useApiAction(updateUserById);
  const doDeleteUser = useApiAction(deleteUserById);

  const { permissions } = useSelfSession();

  useCheckPermissions('user$update');

  const onDelete = useAsyncCallback(async () => {
    try {
      const status = await showModal(ConfirmationDialog, {
        prompt:
          'Are you sure you want to delete this user? The action is irreversible',
      });

      if (status) {
        await doDeleteUser(id);

        await redirect('/settings/users');

        notification.info('User deleted successfully');
      }
    } catch (error) {
      console.error(error);

      notification.error('Failed to delete user');
    }
  }, [id, notification, doDeleteUser, redirect, showModal]);

  const onUpdate = useAsyncCallback(
    async (payload: CreateUserPayload) => {
      if (userResult.status !== 'success') {
        return;
      }

      const { id } = userResult.value;

      try {
        const { displayName, password, permissions } = payload;

        await doUpdateUser(id, {
          displayName,
          permissions,
          password: password.length === 0 ? undefined : password,
        });

        await redirect('/settings/users');

        notification.info('User updated successfully');
      } catch (error) {
        console.error(error);

        notification.error('Failed to update user');
      }
    },
    [doUpdateUser, notification, redirect, userResult]
  );

  return (
    <DataLoader result={userResult} className={styles.root}>
      {(user) => (
        <>
          <Toolbar>
            {permissions.has('user$delete') && !user.isAdmin && (
              <Button onClick={onDelete} hasIcon>
                <DeleteIcon />
                Delete
              </Button>
            )}
          </Toolbar>

          <AccessUserView
            initialValue={user}
            onAction={onUpdate}
            readOnly={user.isAdmin}
          />
        </>
      )}
    </DataLoader>
  );
}
