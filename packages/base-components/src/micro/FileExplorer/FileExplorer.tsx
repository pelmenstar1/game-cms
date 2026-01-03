import { StorageItemWithId } from '@game-cms/base-types';
import {
  createFolder,
  deleteStorageItemById,
  getStorageItemInfo,
  listStorageItems,
  uploadFile,
} from '@game-cms/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import type { ToClientType } from '@game-cms/core';
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
import { transformItems } from './transform.js';

type FolderId = string | undefined;

export interface FileExplorerProps {
  className?: string;
  visibleMimeTypes?: string[];
  folderId: FolderId;
  onFolderChanged: (value: FolderId) => void;
  onSelectedItemChanged?: (
    value: ToClientType<StorageItemWithId> | undefined
  ) => void;
}

export function FileExplorer({
  className,
  folderId,
  visibleMimeTypes,
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
      const files = await showModal(UploadFileDialog, {
        supportedMimeTypes: visibleMimeTypes,
      });

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
  }, [
    folderId,
    notification,
    visibleMimeTypes,
    doUploadFile,
    refreshItems,
    showModal,
  ]);

  const onDelete = useAsyncCallback(async () => {
    try {
      if (selectedItem) {
        const proceed = await showModal(ConfirmationDialog, {
          prompt:
            'Do you want to delete this file? This action is irreversible',
        });

        if (proceed) {
          await doDeleteItem(selectedItem.id);

          refreshItems();

          notification.info('File deleted');
        }
      }
    } catch {
      notification.error('Failed to delete item');
    }
  }, [doDeleteItem, notification, refreshItems, selectedItem, showModal]);

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
            items={transformItems(items, visibleMimeTypes)}
            selectedItemId={selectedItem?.id}
            onItemSelected={setSelectedItem}
            onItemDoubleClick={onItemDoubleClick}
          />
        </>
      )}
    </DataLoader>
  );
}
