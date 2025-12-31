import { classNames, DeleteIcon, DragHandle, IconButton } from '@game-cms/ui';
import { ReactNode, Ref } from 'react';

import styles from './ItemControlHeader.module.scss';

interface ItemControlHeaderProps {
  className?: string;
  handleRef?: Ref<HTMLButtonElement | null>;

  deleteTitle?: string;
  onDelete?: () => void;

  children?: ReactNode;
}

export function ItemControlHeader({
  className,
  handleRef,
  deleteTitle,
  onDelete,
  children,
}: ItemControlHeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {children}

      {onDelete && deleteTitle && (
        <IconButton
          title={deleteTitle}
          className={styles['delete-button']}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}
      <DragHandle ref={handleRef} />
    </div>
  );
}
