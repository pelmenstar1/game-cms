import { NoPasswordUser } from '@game-cms/base-core';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import { getReviewers, updateReviewers } from '@game-cms/entity-checks/client';
import {
  Button,
  DataLoader,
  DeleteIcon,
  IconButton,
  Link,
  List,
  PlusIcon,
  Typography,
  useNotification,
} from '@game-cms/ui';
import { useCallback, useLayoutEffect, useState } from 'react';

import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { useSelfSession } from '@/hooks/useSession';

import styles from './route.module.scss';

export default function Page() {
  const [users, setUsers] = useState<NoPasswordUser[]>([]);

  const [result] = useApiQuery(getReviewers);
  const doUpdateReviewers = useApiAction(updateReviewers);
  const { permissions } = useSelfSession();
  const notification = useNotification();

  useCheckPermissions('entityCheck/base::review/reviewers$get');

  const canChangeReviewers = permissions.has(
    'entityCheck/base::review/reviewers$update'
  );

  useLayoutEffect(() => {
    if (result.status === 'success') {
      setUsers(result.value.users);
    }
  }, [result]);

  const onSave = useCallback(() => {
    doUpdateReviewers({ userIds: users.map(({ id }) => id) })
      .then(() => {
        notification.info('Reviewers updated');
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.error('Failed to save reviewers');
      });
  }, [doUpdateReviewers, notification, users]);

  return (
    <DataLoader result={result} className={styles['content']}>
      {({ users }) => (
        <>
          <List>
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  to={`/settings/users/${user.id}`}
                  className={styles['item']}
                >
                  <Typography>{user.displayName}</Typography>

                  <IconButton
                    title="Remove from reviewers"
                    className={styles['item-delete']}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Link>
              </li>
            ))}
          </List>

          {canChangeReviewers && (
            <IconButton title="Add reviewer" className={styles['add']}>
              <PlusIcon />
            </IconButton>
          )}

          {canChangeReviewers && (
            <Button
              buttonVariant="solid"
              onClick={onSave}
              className={styles['save']}
            >
              Save
            </Button>
          )}
        </>
      )}
    </DataLoader>
  );
}
