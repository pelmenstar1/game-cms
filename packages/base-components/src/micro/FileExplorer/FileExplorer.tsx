import { StorageItemWithId } from '@game-cms/base-core';
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FileControlHeader } from '../FileControlHeader/index.js';
import { FileGrid, FileItem } from '../FileGrid/index.js';
import { FolderNameModal } from '../FolderNameModal/index.js';
import { UploadFileDialog } from '../UploadFileDialog/index.js';
import styles from './FileExplorer.module.scss';
import { transformItems } from './transform.js';

const FileInfoModal = React.lazy(async () => {
  const { FileInfoModal } = await import('../FileInfoModal/index.js');

  return { default: FileInfoModal };
});

type FolderId = string | undefined;

export interface FileExplorerProps {
  className?: string;
  visibleMimeTypes?: string[];
  multiple?: boolean;
  folderId: FolderId;
  onFolderChanged: (value: FolderId) => void;
  onSelectedItemsChanged?: (value: ToClientType<StorageItemWithId[]>) => void;
}

export function FileExplorer({
  className,
  folderId,
  visibleMimeTypes,
  multiple,
  onFolderChanged,
  onSelectedItemsChanged,
}: FileExplorerProps) {
  const showModal = useModal();
  const notification = useNotification();

  const listOptions = useMemo(
    () => ({ size: 20, parent: folderId }),
    [folderId]
  );

  const [selectedItemIds, setSelectedItems] = useState<string[]>([]);

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
      if (selectedItemIds.length > 0) {
        const proceed = await showModal(ConfirmationDialog, {
          prompt:
            'Do you want to delete this file? This action is irreversible',
        });

        if (proceed) {
          await Promise.all(selectedItemIds.map((id) => doDeleteItem(id)));

          refreshItems();

          notification.info('File deleted');
        }
      }
    } catch {
      notification.error('Failed to delete item');
    }
  }, [doDeleteItem, notification, refreshItems, selectedItemIds, showModal]);

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

  const onItemDoubleClick = useCallback(
    (item: FileItem) => {
      if (item.type === 'folder') {
        onFolderChanged(item.id);
      } else {
        void showModal(FileInfoModal, {
          item,
        });
      }
    },
    [onFolderChanged, showModal]
  );

  const onGoToParent = useCallback(() => {
    if (itemInfo.status === 'success' && itemInfo.value) {
      const { parent } = itemInfo.value;

      onFolderChanged(parent);
    }
  }, [itemInfo, onFolderChanged]);

  useEffect(() => {
    if (itemsResult.status === 'success') {
      const items = itemsResult.value.items.filter((item) =>
        selectedItemIds.includes(item.id)
      );

      onSelectedItemsChanged?.(items);
    }
  }, [itemsResult, selectedItemIds, onSelectedItemsChanged]);

  return (
    <DataLoader
      className={classNames(styles.root, className)}
      result={itemsResult}
    >
      {({ items }) => (
        <>
          <FileControlHeader
            isDeleteEnabled={selectedItemIds.length > 0}
            hasParent={folderId !== undefined}
            onDelete={onDelete}
            onUpload={onUpload}
            onCreateFolder={onCreateFolder}
            onRefresh={refreshItems}
            onGoToParent={onGoToParent}
          />
          <FileGrid
            className={styles.grid}
            multiple={multiple}
            items={transformItems(items, visibleMimeTypes)}
            selectedItemIds={selectedItemIds}
            onItemsSelected={setSelectedItems}
            onItemDoubleClick={onItemDoubleClick}
          />
        </>
      )}
    </DataLoader>
  );
}
