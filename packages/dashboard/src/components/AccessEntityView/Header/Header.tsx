import { EntitySchema } from '@game-cms/base-core';
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

export interface HeaderProps {
  className?: string;
  schema: EntitySchema;
  hasInitialValue: boolean;
  previewEnabled: boolean;

  onDelete?: () => void;
  onPreviewEnabledChanged?: (state: boolean) => void;
}

export function Header({
  className,
  schema,
  hasInitialValue,
  previewEnabled,
  onDelete,
  onPreviewEnabledChanged,
}: HeaderProps) {
  const { permissions } = useSelfSession();

  return (
    <div className={classNames(styles.root, className)}>
      <Typography variant="h4" className={styles.title}>
        {schema.title}
      </Typography>

      {hasInitialValue && permissions.has(`entity/${schema.id}$delete`) && (
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
