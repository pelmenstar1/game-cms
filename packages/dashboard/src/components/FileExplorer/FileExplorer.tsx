import {
  type ClientStorageItemWithMeta,
} from '@game-cms/base-types';
import { listStorageItems } from '@game-cms/client';
import { classNames } from '@game-cms/ui';
import { useCallback, useState } from 'react';

import { useApiQuery } from '@/hooks/useApiQuery';

import { DataLoader } from '../DataLoader';
import { FileControlHeader } from '../FileControlHeader';
import { FileGrid, type FileItem } from '../FileGrid';
import styles from './FileExplorer.module.scss';

export interface FileExplorerProps {
  className?: string;
}

function transformItems(items: ClientStorageItemWithMeta[]) {
  return items.map((item): FileItem => {
    if (item.type === 0) {
      return { ...item, type: 'file' };
    }

    return { ...item, type: 'folder' };
  });
}

export function FileExplorer({ className }: FileExplorerProps) {
  const [folderId, setFolderId] = useState<string>();
  const [itemsResult] = useApiQuery(listStorageItems, [{ size: 20, folderId }]);

  const [selectedItem, setSelectedItem] = useState<FileItem>();

  const onDelete = useCallback(() => {}, []);

  return (
    <DataLoader
      className={classNames(styles.root, className)}
      result={itemsResult}
    >
      {({ items }) => (
        <>
          <FileControlHeader
            isDeleteEnabled={selectedItem !== undefined}
            onDelete={onDelete}
          />
          <FileGrid
            items={transformItems(items)}
            onItemSelected={setSelectedItem}
            selectedItemId={selectedItem?.id}
          />
        </>
      )}
    </DataLoader>
  );
}
