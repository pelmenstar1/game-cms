import { invokeEntityCheckAction } from '@game-cms/base-api/client';
import { useApiAction, useSelfSession } from '@game-cms/base-components/shared';
import { EntityCheckRenderer } from '@game-cms/base-core';
import {
  Button,
  CheckIcon,
  classNames,
  CloseIcon,
  List,
  Typography,
  useNotification,
} from '@game-cms/ui';
import { useCallback } from 'react';

import styles from './entityAccessRenderer.module.scss';

const renderer: EntityCheckRenderer = ({
  className,
  entityId,
  documentId,
  data,
}) => {
  const doInvokeAction = useApiAction(invokeEntityCheckAction);

  const { actorId, permissions } = useSelfSession();
  const canApprove =
    permissions.has('entityCheck/base::review$approve') &&
    data.reviewers.some(
      ({ user, approved }) => user.id === actorId && !approved
    );

  const notification = useNotification();

  const onApprove = useCallback(() => {
    doInvokeAction('base::review', entityId, documentId, 'approve', undefined)
      .then(() => {
        notification.info('Entity approved');
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.error('Failed to approve entity');
      });
  }, [doInvokeAction, entityId, documentId, notification]);

  return (
    <div className={classNames(styles.root, className)}>
      <Typography weight="bold" variant="caption" className={styles.header}>
        Reviews
      </Typography>

      <List>
        {data.reviewers.map(({ user, approved }) => {
          const Icon = approved ? CheckIcon : CloseIcon;

          return (
            <li
              key={user.id}
              className={classNames(
                styles['item'],
                approved && styles['item-approved']
              )}
            >
              <Typography weight="bold">{user.displayName}</Typography>
              <Icon className={styles['item-icon']} />
            </li>
          );
        })}
      </List>

      {canApprove && (
        <Button
          buttonVariant="outlined"
          onClick={onApprove}
          className={styles['approve-button']}
        >
          Approve
        </Button>
      )}
    </div>
  );
};

export default renderer;
