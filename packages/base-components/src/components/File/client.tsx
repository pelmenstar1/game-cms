import { ComponentRenderer } from '@game-cms/types';
import {
  classNames,
  IconButton,
  PlusIcon,
  Typography,
  useAsyncCallback,
  useModal,
} from '@game-cms/ui';

import { FileExplorerModal } from '../../micro/FileExplorerModal/index.js';
import styles from './client.module.scss';

export const renderer: ComponentRenderer<'base::file'> = ({
  data,
  error,
  onDataChanged,
}) => {
  const showModal = useModal();

  const onAddFile = useAsyncCallback(async () => {
    const result = await showModal(FileExplorerModal, {});

    if (result) {
      onDataChanged?.({ items: [...data.items, result] });
    }
  }, [data.items, onDataChanged, showModal]);

  return (
    <div className={styles.root}>
      <div
        className={classNames(styles.preview, error && styles['preview-error'])}
      >
        <IconButton title="Add file" onClick={onAddFile}>
          <PlusIcon />
        </IconButton>
      </div>

      {error && <Typography>{error}</Typography>}
    </div>
  );
};
