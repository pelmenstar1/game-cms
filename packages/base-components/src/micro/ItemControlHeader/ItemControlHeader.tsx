import { classNames, DeleteIcon, DragHandle, IconButton } from '@game-cms/ui';
import { ReactNode, Ref } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ItemControlHeader.module.scss';

interface ItemControlHeaderProps {
  className?: string;
  handleRef?: Ref<HTMLButtonElement | null>;

  readonly?: boolean;
  onDelete?: () => void;

  children?: ReactNode;
}

export function ItemControlHeader({
  className,
  handleRef,
  children,
  readonly,
  onDelete,
}: ItemControlHeaderProps) {
  const { t } = useTranslation('base');

  return (
    <div className={classNames(styles.root, className)}>
      {children}

      {onDelete && !readonly && (
        <IconButton
          title={t('common.delete')}
          className={styles['delete-button']}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}
      {!readonly && <DragHandle ref={handleRef} />}
    </div>
  );
}
