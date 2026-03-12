import { AsyncFileGroupPreviewRenderer } from '@game-cms/base-core';
import {
  IndeterminateCircularProgress,
  ModalDialog,
  ModalProps,
} from '@game-cms/ui';
import React, { JSX, Suspense, useMemo } from 'react';

export interface FileGroupPreviewModalProps<PreviewProps> extends ModalProps {
  preview: AsyncFileGroupPreviewRenderer<PreviewProps>;
  previewProps: PreviewProps;
}

export function FileGroupPreviewModal<
  PreviewProps extends JSX.IntrinsicAttributes,
>({
  preview,
  previewProps,
  onClose,
}: FileGroupPreviewModalProps<PreviewProps>) {
  const Component = useMemo(() => React.lazy(preview), [preview]);

  return (
    <ModalDialog title="Preview" onClose={onClose}>
      <Suspense fallback={<IndeterminateCircularProgress />}>
        <Component {...previewProps} />
      </Suspense>
    </ModalDialog>
  );
}
