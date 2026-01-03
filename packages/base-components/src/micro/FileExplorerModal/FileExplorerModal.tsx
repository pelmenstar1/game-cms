import {
  StorageFileItemWithId,
  StorageItemType,
  StorageItemWithId,
} from '@game-cms/base-types';
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

  const [selectedItem, setSelectedItem] =
    useState<ToClientType<StorageItemWithId>>();

  const isFileSelected =
    selectedItem !== undefined && selectedItem.type === StorageItemType.FILE;

  const handleClose = useCallback(() => {
    if (isFileSelected) {
      onClose(selectedItem);
    }
  }, [isFileSelected, selectedItem, onClose]);

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
        onSelectedItemChanged={setSelectedItem}
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
