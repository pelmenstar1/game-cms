import {
  createFolder,
  deleteStorageItemById,
  getStorageItemInfo,
  listStorageItems,
  uploadFile,
} from '@game-cms/base-api/client';
import { StorageItemWithId } from '@game-cms/base-core';
import type { ToClientType } from '@game-cms/core';
import {
  classNames,
  ConfirmationDialog,
  DataLoader,
  namedLazy,
  PagePresenter,
  useAsyncCallback,
  useDebouncedValue,
  useModal,
  useNotification,
} from '@game-cms/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useApiAction } from '../../hooks/useApiAction.js';
import { useApiQuery } from '../../hooks/useApiQuery.js';
import { FileGrid, FileItem } from '../FileGrid/index.js';
import { FileControlHeader } from './FileControlHeader/index.js';
import styles from './FileExplorer.module.scss';
import { transformItems } from './transform.js';

const FileInfoModal = namedLazy(
  () => import('../FileInfoModal/index.js'),
  'FileInfoModal'
);

const FolderNameModal = namedLazy(
  () => import('../FolderNameModal/index.js'),
  'FolderNameModal'
);

const UploadFileDialog = namedLazy(
  () => import('../UploadFileDialog/index.js'),
  'UploadFileDialog'
);

type FolderId = string | undefined;

const PAGE_SIZE = 20;

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

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const stableSearch = useDebouncedValue(search, 500);

  const listOptions = useMemo(
    () => ({
      size: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      parent: folderId,
      search: stableSearch,
    }),
    [folderId, page, stableSearch]
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

  useEffect(() => {
    setPage(1);
  }, [folderId]);

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
      {({ items, meta }) => (
        <>
          <FileControlHeader
            isDeleteEnabled={selectedItemIds.length > 0}
            hasParent={folderId !== undefined}
            items={items}
            searchQuery={search}
            onDelete={onDelete}
            onUpload={onUpload}
            onCreateFolder={onCreateFolder}
            onRefresh={refreshItems}
            onGoToParent={onGoToParent}
            onSearchQueryChanged={setSearch}
          />
          <PagePresenter
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={meta.totalCount}
            onButtonClick={setPage}
            className={styles['page-presenter']}
          >
            <FileGrid
              className={styles.grid}
              multiple={multiple}
              items={transformItems(items, visibleMimeTypes)}
              selectedItemIds={selectedItemIds}
              onItemsSelected={setSelectedItems}
              onItemDoubleClick={onItemDoubleClick}
            />
          </PagePresenter>
        </>
      )}
    </DataLoader>
  );
}
