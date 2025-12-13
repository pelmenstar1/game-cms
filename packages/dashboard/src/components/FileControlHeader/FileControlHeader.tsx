import {
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
  onDelete?: () => void;
  onUpload?: () => void;
  onCreateFolder?: () => void;
}

export function FileControlHeader({
  className,
  isDeleteEnabled,
  onDelete,
  onUpload,
  onCreateFolder,
}: FileControlHeaderProps) {
  return (
    <List className={classNames(styles.root, className)}>
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
