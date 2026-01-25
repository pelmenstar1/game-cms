import { formatFileSize } from '@game-cms/shared/string';
import { classNames, Typography } from '@game-cms/ui';
import { type MouseEvent, SyntheticEvent, useCallback } from 'react';

import type { FileItem } from '../FileGrid/index.js';
import { FileGridEntryThumbnail } from '../FileGridEntryThumbnail/index.js';
import styles from './FileGridEntry.module.scss';

export interface FileGridEntryProps {
  className?: string;
  item: FileItem;

  isSelected?: boolean;

  onSelectionChanged?: (state: boolean) => void;
  onDoubleClick?: () => void;
}

function stopPropagationHandler(event: SyntheticEvent) {
  event.stopPropagation();
}

export function FileGridEntry({
  className,
  item,
  isSelected,
  onSelectionChanged,
  onDoubleClick,
}: FileGridEntryProps) {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();

      onSelectionChanged?.(!isSelected);
    },
    [isSelected, onSelectionChanged]
  );

  return (
    <div
      className={classNames(
        styles.root,
        isSelected && styles['root-selected'],
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onPointerDown={stopPropagationHandler}
    >
      <FileGridEntryThumbnail className={styles.thumbnail} source={item} />

      <Typography className={styles.name}>{item.name}</Typography>
      {item.type === 'file' && (
        <Typography variant="caption">{formatFileSize(item.size)}</Typography>
      )}
    </div>
  );
}
