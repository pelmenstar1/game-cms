import { clampNumber } from '@game-cms/shared';
import { removeIndex } from '@game-cms/shared/collections';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  classNames,
  DeleteIcon,
  IconButton,
  PlusIcon,
  Typography,
} from '@game-cms/ui';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { FilePreview } from '../FilePreview/index.js';
import styles from './FileList.module.scss';

type FileListItem = {
  url: string;
  name: string;
  mime: string;
};

export interface FileListProps<T extends FileListItem> {
  className?: string;
  items: T[];
  onItemsChanged?: (items: T[]) => void;
  onAddFile?: () => void;
}

interface PagerButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

function PagerButton({ disabled, onClick, children }: PagerButtonProps) {
  return (
    <Button
      hasIcon
      className={styles['pager-move-button']}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function FileList<T extends FileListItem>({
  className,
  items,
  onItemsChanged,
  onAddFile,
}: FileListProps<T>) {
  const [item, setItem] = useState({ index: 0, value: items[0] });

  const onDelete = useCallback(() => {
    onItemsChanged?.(removeIndex(items, item.index));
  }, [item.index, items, onItemsChanged]);

  useEffect(() => {
    setItem(({ index }) => {
      const newIndex = clampNumber(0, items.length - 1, index);

      return { index: newIndex, value: items[newIndex] };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const moveIndex = (delta: number) => {
    setItem(({ index }) => ({
      index: index + delta,
      value: items[index + delta],
    }));
  };

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.pager}>
        <PagerButton
          disabled={item.index === 0}
          onClick={() => {
            moveIndex(-1);
          }}
        >
          <ArrowLeftIcon />
        </PagerButton>

        <FilePreview
          className={styles['preview']}
          url={item.value.url}
          mime={item.value.mime}
        />

        <PagerButton
          disabled={item.index === items.length - 1}
          onClick={() => {
            moveIndex(1);
          }}
        >
          <ArrowRightIcon />
        </PagerButton>
      </div>

      <div className={styles.footer}>
        <Typography variant="caption">{item.value.name}</Typography>

        <div className={styles['footer-actions']}>
          <IconButton title="Add file" onClick={onAddFile} hover="fill">
            <PlusIcon />
          </IconButton>

          <IconButton title="Delete item" onClick={onDelete} hover="fill">
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
