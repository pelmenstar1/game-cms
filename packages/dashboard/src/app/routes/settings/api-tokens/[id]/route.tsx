import { deleteApiToken, getApiTokenInfo } from '@game-cms/base-api/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import {
  Button,
  ConfirmationDialog,
  DataLoader,
  DeleteIcon,
  Labeled,
  Typography,
  useAsyncCallback,
  useModal,
  useNotification,
  useTypedNavigate,
} from '@game-cms/ui';

import { PermissionsEditor } from '@/components/PermissionsEditor';
import { formatExpirationDate } from '@/utils/expirationDate';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const { id } = params;
  const [tokenResult] = useApiQuery(getApiTokenInfo, [id]);

  const showModal = useModal();
  const redirect = useTypedNavigate();
  const notification = useNotification();

  const doDeleteApiToken = useApiAction(deleteApiToken);

  const deleteToken = useAsyncCallback(async () => {
    try {
      const status = await showModal(ConfirmationDialog, {
        prompt: `You won't be able to use this token after deleting it. Are you sure?`,
      });

      if (status) {
        await doDeleteApiToken(id);

        await redirect('/settings/api-tokens');

        notification.info('API token deleted successfully');
      }
    } catch {
      notification.error('Failed to delete API token');
    }
  }, [id, notification, doDeleteApiToken, redirect, showModal]);

  return (
    <DataLoader result={tokenResult} className={styles.root}>
      {(token) => (
        <>
          <div className={styles.header}>
            <Button buttonVariant="outlined" onClick={deleteToken} hasIcon>
              <DeleteIcon />
              Delete
            </Button>
          </div>

          <Labeled title="Name">
            <Typography>{token.name}</Typography>
          </Labeled>

          <Labeled title="Expiration">
            <Typography>
              Until {formatExpirationDate(token.expirationDate)}
            </Typography>
          </Labeled>

          <Labeled title="Permissions">
            <PermissionsEditor
              selectedPermissions={token.permissions}
              readOnly
            />
          </Labeled>
        </>
      )}
    </DataLoader>
  );
}
