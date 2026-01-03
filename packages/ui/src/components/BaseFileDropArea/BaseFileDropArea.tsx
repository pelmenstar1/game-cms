// Base unstyled (only functional) building block for file drop areas.

import { type ComponentProps } from 'react';

import { FileDrop } from '../FileDrop';
import { Typography } from '../Typography';
import { UploadFileButton } from '../UploadFileButton';

export interface BaseFileDropAreaProps extends ComponentProps<'div'> {
  disabled?: boolean;

  uploadText?: string;
  dragText?: string;
  supportedMimeTypes?: string[];

  onFiles?: (files: FileList) => void;
}

export function BaseFileDropArea({
  onFiles,
  disabled,
  uploadText,
  dragText,
  supportedMimeTypes,
  ...rest
}: BaseFileDropAreaProps) {
  const accept = supportedMimeTypes && supportedMimeTypes.join('');

  return (
    <FileDrop onFiles={onFiles} disabled={disabled}>
      <div {...rest}>
        <UploadFileButton
          accept={accept}
          onFiles={onFiles}
          disabled={disabled}
          buttonVariant="solid"
          text={uploadText}
        />

        <Typography>{dragText ?? 'Or drop it here'}</Typography>
      </div>
    </FileDrop>
  );
}
