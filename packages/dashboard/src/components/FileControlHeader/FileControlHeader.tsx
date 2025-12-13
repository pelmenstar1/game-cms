import {
  ArrowLeftIcon,
  classNames,
  DeleteIcon,
  IconButton,
  List,
  NewFolderIcon,
  UploadIcon,
} from '@game-cms/ui';

import styles from './FileControlHeader.module.scss';

export interface FileControlHeaderProps {
  className?: string;

  isDeleteEnabled?: boolean;
  hasParent?: boolean;

  onDelete?: () => void;
  onUpload?: () => void;
  onCreateFolder?: () => void;
  onGoToParent?: () => void;
}

export function FileControlHeader({
  className,
  isDeleteEnabled,
  hasParent,
  onDelete,
  onUpload,
  onCreateFolder,
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
    </List>
  );
}
