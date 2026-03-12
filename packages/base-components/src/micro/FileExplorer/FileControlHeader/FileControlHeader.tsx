import { StorageClientItem } from '@game-cms/base-core';
import {
  ArrowLeftIcon,
  classNames,
  DeleteIcon,
  IconButton,
  List,
  NewFolderIcon,
  RefreshIcon,
  UploadIcon,
} from '@game-cms/ui';

import { FileGroupPreviewButton } from '../FileGroupPreviewButton/index.js';
import styles from './FileControlHeader.module.scss';

export interface FileControlHeaderProps {
  className?: string;
  items: StorageClientItem[];
  isDeleteEnabled?: boolean;
  hasParent?: boolean;

  onDelete?: () => void;
  onUpload?: () => void;
  onCreateFolder?: () => void;
  onRefresh?: () => void;
  onGoToParent?: () => void;
}

export function FileControlHeader({
  className,
  items,
  isDeleteEnabled,
  hasParent,
  onDelete,
  onUpload,
  onCreateFolder,
  onRefresh,
  onGoToParent,
}: FileControlHeaderProps) {
  return (
    <List className={classNames(styles.root, className)}>
      <IconButton
        title="Back"
        onClick={onGoToParent}
        disabled={!hasParent}
        className={classNames(
          styles['back'],
          !hasParent && styles['back-hidden']
        )}
      >
        <ArrowLeftIcon />
      </IconButton>

      <IconButton title="Refresh" onClick={onRefresh} hover="fill">
        <RefreshIcon />
      </IconButton>

      <IconButton
        title="Delete"
        disabled={!isDeleteEnabled}
        onClick={onDelete}
        hover="fill"
      >
        <DeleteIcon />
      </IconButton>

      <IconButton title="New folder" onClick={onCreateFolder}>
        <NewFolderIcon />
      </IconButton>

      <IconButton title="Upload" onClick={onUpload} hover="fill">
        <UploadIcon />
      </IconButton>

      <FileGroupPreviewButton items={items} />
    </List>
  );
}
