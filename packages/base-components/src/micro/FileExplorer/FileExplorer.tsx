import {
  StorageItemType,
  StorageItemWithId,
  type StorageItemWithMeta,
} from '@game-cms/base-types';
import {
  createFolder,
  deleteStorageItemById,
  getStorageItemInfo,
  listStorageItems,
  uploadFile,
} from '@game-cms/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import type { ToClientType } from '@game-cms/types';
import {
  classNames,
  ConfirmationDialog,
  DataLoader,
  useAsyncCallback,
  useModal,
  useNotification,
} from '@game-cms/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FileControlHeader } from '../FileControlHeader/index.js';
import { FileGrid, type FileItem } from '../FileGrid/index.js';
import { FolderNameModal } from '../FolderNameModal/index.js';
import { UploadFileDialog } from '../UploadFileDialog/index.js';
import styles from './FileExplorer.module.scss';

type FolderId = string | undefined;

export interface FileExplorerProps {
  className?: string;
  folderId: FolderId;
  onFolderChanged: (value: FolderId) => void;
  onSelectedItemChanged?: (
    value: ToClientType<StorageItemWithId> | undefined
  ) => void;
}

function transformItems(items: ToClientType<StorageItemWithMeta>[]) {
  return items.map((item): FileItem => {
    if (item.type === StorageItemType.FILE) {
      return { ...item, type: 'file' };
    }

    return { ...item, type: 'folder' };
  });
}

export function FileExplorer({
  className,
  folderId,
  onFolderChanged,
  onSelectedItemChanged,
}: FileExplorerProps) {
  const showModal = useModal();
  const notification = useNotification();

  const listOptions = useMemo(
    () => ({ size: 20, parent: folderId }),
    [folderId]
  );

  const [selectedItem, setSelectedItem] = useState<FileItem>();

  const [itemInfo] = useApiQuery(
    async (context, id) => (id ? getStorageItemInfo(context, id) : null),
    [folderId]
  );
  const [itemsResult, refreshItems] = useApiQuery(listStorageItems, [
    listOptions,
  ]);

  const doUploadFile = useApiAction(uploadFile);
  const doDeleteItem = useApiAction(deleteStorageItemById);
  const doCreateFolder = useApiAction(createFolder);

  const onUpload = useAsyncCallback(async () => {
    try {
      const files = await showModal(UploadFileDialog, {});

      if (files && files.length > 0) {
        await Promise.all(
          files.map((file) =>
            doUploadFile({
              content: file,
              filename: file.name,
              parent: folderId,
            })
          )
        );

        refreshItems();

        notification.info('Files uploaded successfully');
      }
    } catch {
      notification.error('Failed to upload files');
    }
  }, [doUploadFile, folderId, notification, refreshItems, showModal]);

  const onDelete = useAsyncCallback(async () => {
    try {
      if (selectedItem) {
        const proceed = await showModal(ConfirmationDialog, {
          prompt:
            'Do you want to delete this file? This action is irreversible',
        });

        if (proceed) {
          await doDeleteItem(selectedItem.id);

          notification.info('File deleted');
        }
      }
    } catch {
      notification.error('Failed to delete item');
    }
  }, [doDeleteItem, notification, selectedItem, showModal]);

  const onCreateFolder = useAsyncCallback(async () => {
    try {
      const name = await showModal(FolderNameModal, {});

      if (name) {
        await doCreateFolder({ name, parent: folderId });

        notification.info('Folder created');

        refreshItems();
      }
    } catch {
      notification.error('Failed to create a folder');
    }
  }, [showModal, doCreateFolder, folderId, notification, refreshItems]);

  const onItemDoubleClick = useCallback(() => {
    if (selectedItem && selectedItem.type === 'folder') {
      onFolderChanged(selectedItem.id);
    }
  }, [onFolderChanged, selectedItem]);

  const onGoToParent = useCallback(() => {
    if (itemInfo.status === 'success' && itemInfo.value) {
      const { parent } = itemInfo.value;

      onFolderChanged(parent);
    }
  }, [itemInfo, onFolderChanged]);

  useEffect(() => {
    if (itemsResult.status === 'success') {
      const item = itemsResult.value.items.find(
        (item) => item.id === selectedItem?.id
      );

      onSelectedItemChanged?.(item);
    }
  }, [itemsResult, onSelectedItemChanged, selectedItem]);

  return (
    <DataLoader
      className={classNames(styles.root, className)}
      result={itemsResult}
    >
      {({ items }) => (
        <>
          <FileControlHeader
            isDeleteEnabled={selectedItem !== undefined}
            hasParent={folderId !== undefined}
            onDelete={onDelete}
            onUpload={onUpload}
            onCreateFolder={onCreateFolder}
            onGoToParent={onGoToParent}
          />
          <FileGrid
            className={styles.grid}
            items={transformItems(items)}
            selectedItemId={selectedItem?.id}
            onItemSelected={setSelectedItem}
            onItemDoubleClick={onItemDoubleClick}
          />
        </>
      )}
    </DataLoader>
  );
}
