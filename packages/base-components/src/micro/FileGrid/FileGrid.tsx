import { StorageAddonHydratedDataMap } from '@game-cms/base-core';
import { classNames, SelectionGrid } from '@game-cms/ui';
import { useCallback } from 'react';

import { FileGridEntry } from '../FileGridEntry/index.js';
import styles from './FileGrid.module.scss';

interface BaseFileItem {
  id: string;
  name: string;
}

interface PlainFileItem extends BaseFileItem {
  type: 'file';
  mime: string;
  size: number;
  url: string;
  addons: StorageAddonHydratedDataMap;
}

interface FolderItem extends BaseFileItem {
  type: 'folder';
}

export type FileItem = PlainFileItem | FolderItem;

export interface FileGridProps {
  className?: string;
  items: FileItem[];
  multiple?: boolean;
  selectedItemIds: string[];

  onItemsSelected?: (ids: string[]) => void;
  onItemDoubleClick?: (item: FileItem) => void;
}

export function FileGrid({
  className,
  items,
  multiple,
  selectedItemIds,
  onItemsSelected,
  onItemDoubleClick,
}: FileGridProps) {
  const onSelectionChanged = useCallback(
    (selection: number[]) => {
      onItemsSelected?.(selection.map((i) => items[i].id));
    },
    [items, onItemsSelected]
  );

  return (
    <SelectionGrid
      className={classNames(styles.root, className)}
      onSelectionChanged={onSelectionChanged}
      disabled={!multiple}
    >
      {items.map((item) => (
        <FileGridEntry
          key={item.id}
          item={item}
          isSelected={selectedItemIds.includes(item.id)}
          onSelectionChanged={(state) => {
            onItemsSelected?.(state ? [item.id] : []);
          }}
          onDoubleClick={() => {
            onItemDoubleClick?.(item);
          }}
        />
      ))}
    </SelectionGrid>
  );
}
