import { ComponentDefaultRenderer } from '@game-cms/core';
import {
  classNames,
  IconButton,
  namedLazy,
  PlusIcon,
  Typography,
  useAsyncCallback,
  useModal,
} from '@game-cms/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { FileList } from '../../micro/FileList/index.js';
import styles from './renderer.module.scss';
import { FileClientDataItem, Id } from './types.js';

const FileExplorerModal = namedLazy(
  () => import('../../micro/FileExplorerModal/index.js'),
  'FileExplorerModal'
);

export const renderer: ComponentDefaultRenderer<Id> = ({
  data: items,
  options: { supportedMimeTypes, maxItems },
  error,
  readOnly,
  onDataChanged,
}) => {
  const { t } = useTranslation('base', {
    keyPrefix: 'components.File',
  });

  const showModal = useModal();

  const onAddFile = useAsyncCallback(async () => {
    const result = await showModal(FileExplorerModal, {
      supportedMimeTypes,
    });

    if (result) {
      onDataChanged?.([...items, result]);
    }
  }, [items, supportedMimeTypes, onDataChanged, showModal]);

  const onItemsChanged = useCallback(
    (items: FileClientDataItem[]) => {
      onDataChanged?.(items);
    },
    [onDataChanged]
  );

  const errorText = error ? t(`errors.${error}`) : undefined;

  return (
    <div>
      <div
        className={classNames(
          styles['preview-container'],
          error && styles['preview-container-error']
        )}
      >
        {items.length > 0 ? (
          <FileList
            className={styles['preview-list']}
            items={items}
            maxItems={maxItems}
            readOnly={readOnly}
            onItemsChanged={onItemsChanged}
            onAddFile={onAddFile}
          />
        ) : (
          !readOnly && (
            <IconButton
              title={t('addFile')}
              onClick={onAddFile}
              className={styles['single-add-button']}
            >
              <PlusIcon />
            </IconButton>
          )
        )}
      </div>

      {error && (
        <Typography className={styles['error']}>{errorText}</Typography>
      )}
    </div>
  );
};
