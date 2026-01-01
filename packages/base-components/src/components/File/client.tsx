import { ComponentRenderer } from '@game-cms/types';
import {
  classNames,
  IconButton,
  PlusIcon,
  Typography,
  useAsyncCallback,
  useModal,
} from '@game-cms/ui';
import { useCallback } from 'react';

import { FileExplorerModal } from '../../micro/FileExplorerModal/index.js';
import { FileList } from '../../micro/FileList/index.js';
import styles from './client.module.scss';
import { FileClientDataItem } from './types.js';

export const renderer: ComponentRenderer<'base::file'> = ({
  data: { items },
  error,
  onDataChanged,
}) => {
  const showModal = useModal();

  const onAddFile = useAsyncCallback(async () => {
    const result = await showModal(FileExplorerModal, {});

    if (result) {
      onDataChanged?.({ items: [...items, result] });
    }
  }, [items, onDataChanged, showModal]);

  const onItemsChanged = useCallback(
    (items: FileClientDataItem[]) => {
      onDataChanged?.({ items });
    },
    [onDataChanged]
  );

  return (
    <div className={styles.root}>
      <div
        className={classNames(
          styles['preview-container'],
          error && styles['preview-error']
        )}
      >
        {items.length > 0 ? (
          <FileList
            items={items}
            onItemsChanged={onItemsChanged}
            onAddFile={onAddFile}
            className={styles['preview-list']}
          />
        ) : (
          <IconButton
            title="Add file"
            onClick={onAddFile}
            className={styles['single-add-button']}
          >
            <PlusIcon />
          </IconButton>
        )}
      </div>

      {error && <Typography>{error}</Typography>}
    </div>
  );
};
