import { classNames } from '../../utils/classNames';
import { BaseFileDropArea } from '../BaseFileDropArea';
import styles from './FileDropArea.module.scss';

export type FileDropAreaProps = {
  className?: string;
  onFiles?: (files: FileList) => void;
};

export function FileDropArea({ onFiles, className }: FileDropAreaProps) {
  return (
    <BaseFileDropArea
      className={classNames(styles.root, className)}
      onFiles={onFiles}
    />
  );
}
