import { EntityClientSchemaById, EntityId } from '@game-cms/base-core';
import {
  ArrowLeftIcon,
  classNames,
  DeleteIcon,
  IconButton,
  IconLinkButton,
  IconSwitchButton,
  PreviewIcon,
  Typography,
} from '@game-cms/ui';

import { useSelfSession } from '../../../hooks/useSelfSession.js';
import styles from './Header.module.scss';

export interface HeaderProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntityClientSchemaById<Id>;
  hasInitialValue: boolean;
  hasPreview: boolean;
  previewEnabled: boolean;

  onDelete?: () => void;
  onPreviewEnabledChanged?: (state: boolean) => void;
}

export function Header<Id extends EntityId>({
  className,
  entityId,
  schema,
  hasInitialValue,
  hasPreview,
  previewEnabled,
  onDelete,
  onPreviewEnabledChanged,
}: HeaderProps<Id>) {
  const { permissions } = useSelfSession();

  return (
    <div className={classNames(styles.root, className)}>
      <IconLinkButton
        className={styles['back-button']}
        title="Back"
        to={`/entities/${entityId}`}
      >
        <ArrowLeftIcon />
      </IconLinkButton>

      <Typography variant="h4" className={styles['title']}>
        {schema.title}
      </Typography>

      {hasInitialValue && permissions.has(`entity/${entityId}$delete`) && (
        <IconButton
          className={styles['icon-button']}
          title="Delete"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}

      {hasPreview && (
        <IconSwitchButton
          className={styles['icon-button']}
          checked={previewEnabled}
          onCheckedChanged={onPreviewEnabledChanged}
        >
          <PreviewIcon />
        </IconSwitchButton>
      )}
    </div>
  );
}
