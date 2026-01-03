import { classNames } from '../../utils/classNames';
import { BaseFileDropArea } from '../BaseFileDropArea';
import styles from './FileDropArea.module.scss';

export type FileDropAreaProps = {
  className?: string;
  supportedMimeTypes?: string[];
  onFiles?: (files: FileList) => void;
};

export function FileDropArea({
  onFiles,
  supportedMimeTypes,
  className,
}: FileDropAreaProps) {
  return (
    <BaseFileDropArea
      supportedMimeTypes={supportedMimeTypes}
      className={classNames(styles.root, className)}
      onFiles={onFiles}
    />
  );
}
