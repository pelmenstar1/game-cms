import { EntityId, EntitySchemaById } from '@game-cms/base-core';
import {
  classNames,
  DeleteIcon,
  IconButton,
  IconSwitchButton,
  PreviewIcon,
  Typography,
} from '@game-cms/ui';

import { useSelfSession } from '@/hooks/useSession';

import styles from './Header.module.scss';

export interface HeaderProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntitySchemaById<Id>;
  hasInitialValue: boolean;
  previewEnabled: boolean;

  onDelete?: () => void;
  onPreviewEnabledChanged?: (state: boolean) => void;
}

export function Header<Id extends EntityId>({
  className,
  entityId,
  schema,
  hasInitialValue,
  previewEnabled,
  onDelete,
  onPreviewEnabledChanged,
}: HeaderProps<Id>) {
  const { permissions } = useSelfSession();

  return (
    <div className={classNames(styles.root, className)}>
      <Typography variant="h4" className={styles.title}>
        {schema.title}
      </Typography>

      {hasInitialValue && permissions.has(`entity/${entityId}$delete`) && (
        <IconButton
          className={classNames(styles['icon-button'], styles.delete)}
          title="Delete"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}

      {schema.preview && (
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
