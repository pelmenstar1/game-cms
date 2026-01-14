import { classNames, DeleteIcon, DragHandle, IconButton } from '@game-cms/ui';
import { ReactNode, Ref } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ItemControlHeader.module.scss';

interface ItemControlHeaderProps {
  className?: string;
  handleRef?: Ref<HTMLButtonElement | null>;

  onDelete?: () => void;

  children?: ReactNode;
}

export function ItemControlHeader({
  className,
  handleRef,
  onDelete,
  children,
}: ItemControlHeaderProps) {
  const { t } = useTranslation('base', {
    keyPrefix: 'micro.ItemControlHeader',
  });

  return (
    <div className={classNames(styles.root, className)}>
      {children}

      {onDelete && (
        <IconButton
          title={t('delete')}
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
