import { classNames } from '@game-cms/ui';

import { FileGridEntry } from '../FileGridEntry';
import styles from './FileGrid.module.scss';

interface BaseFileItem {
  id: string;
  name: string;
}

interface PlainFileItem extends BaseFileItem {
  type: 'file';
  size: number;
  thumbnail?: string;
}

interface FolderItem extends BaseFileItem {
  type: 'folder';
}

export type FileItem = PlainFileItem | FolderItem;

export interface FileGridProps {
  className?: string;
  items: FileItem[];

  selectedItemId?: string;

  onItemSelected?: (item: FileItem | undefined) => void;
  onItemDoubleClick?: (item: FileItem) => void;
}

export function FileGrid({
  className,
  items,
  selectedItemId,
  onItemSelected,
  onItemDoubleClick,
}: FileGridProps) {
  return (
    <div
      className={classNames(styles.root, className)}
      onClick={() => onItemSelected?.(undefined)}
    >
      {items.map((item) => (
        <FileGridEntry
          key={item.name}
          item={item}
          isSelected={item.id === selectedItemId}
          onSelectionChanged={(state) =>
            onItemSelected?.(state ? item : undefined)
          }
          onDoubleClick={() => {
            onItemDoubleClick?.(item);
          }}
        />
      ))}
    </div>
  );
}
