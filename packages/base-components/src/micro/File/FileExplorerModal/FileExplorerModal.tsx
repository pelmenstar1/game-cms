import {
  StorageFileItemWithId,
  StorageItemType,
  StorageItemWithId,
} from '@game-cms/base-core';
import { ToClientType } from '@game-cms/core';
import { Button, ModalDialog, ModalProps } from '@game-cms/ui';
import { useCallback, useState } from 'react';

import { FileExplorer } from '../FileExplorer/index.js';
import styles from './FileExplorerModal.module.scss';

export interface FileExplorerModalProps extends ModalProps<
  ToClientType<StorageFileItemWithId> | undefined
> {
  supportedMimeTypes?: string[];
}

export function FileExplorerModal({
  supportedMimeTypes,
  onClose,
}: FileExplorerModalProps) {
  const [folderId, setFolderId] = useState<string>();

  const [selectedItems, setSelectedItems] = useState<
    ToClientType<StorageItemWithId>[]
  >([]);

  const singleItem = selectedItems[0];
  const isFileSelected =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    singleItem?.type === StorageItemType.FILE;

  const handleClose = useCallback(() => {
    if (isFileSelected) {
      onClose(singleItem);
    }
  }, [isFileSelected, singleItem, onClose]);

  return (
    <ModalDialog
      contentClassName={styles['content']}
      title="Select file"
      onClose={() => {
        onClose(undefined);
      }}
    >
      <FileExplorer
        className={styles['explorer']}
        folderId={folderId}
        onFolderChanged={setFolderId}
        onSelectedItemsChanged={setSelectedItems}
        visibleMimeTypes={supportedMimeTypes}
      />

      <Button
        disabled={!isFileSelected}
        buttonVariant="solid"
        className={styles['select-button']}
        onClick={handleClose}
      >
        Select
      </Button>
    </ModalDialog>
  );
}
