import { classNames, DeleteIcon, IconButton, List } from '@game-cms/ui';

import styles from './FileControlHeader.module.scss';

type Action = 'delete';

type ActionProps = {
  [K in Action as `is${Capitalize<K>}Enabled`]?: boolean;
} & {
  [K in Action as `on${Capitalize<K>}`]?: () => void;
};

export interface FileControlHeaderProps extends ActionProps {
  className?: string;
}

export function FileControlHeader({
  className,
  isDeleteEnabled,
  onDelete,
}: FileControlHeaderProps) {
  return (
    <List className={classNames(styles.root, className)}>
      <IconButton title="Delete" disabled={!isDeleteEnabled} onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </List>
  );
}
