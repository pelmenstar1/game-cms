// Base unstyled (only functional) building block for file drop areas.

import { type ComponentProps, useCallback } from 'react';

import { FileDrop } from '../FileDrop';
import { Typography } from '../Typography';
import { UploadFileButton } from '../UploadFileButton';

export interface BaseFileDropAreaProps extends ComponentProps<'div'> {
  disabled?: boolean;

  uploadText?: string;
  dragText?: string;

  onFiles?: (files: FileList) => void;
}

export function BaseFileDropArea({
  onFiles,
  disabled,
  uploadText,
  dragText,
  ...rest
}: BaseFileDropAreaProps) {
  const gateOnFiles = useCallback(
    (files: FileList) => {
      onFiles?.(files);
    },
    [onFiles]
  );

  return (
    <FileDrop onFiles={gateOnFiles} disabled={disabled}>
      <div {...rest}>
        <UploadFileButton
          onFiles={gateOnFiles}
          disabled={disabled}
          buttonVariant="solid"
          text={uploadText}
        />

        <Typography>{dragText ?? 'Or drop it here'}</Typography>
      </div>
    </FileDrop>
  );
}
