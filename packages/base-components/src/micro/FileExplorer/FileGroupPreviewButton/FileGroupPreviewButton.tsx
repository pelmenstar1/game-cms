import {
  AsyncFileGroupPreviewRenderer,
  StorageClientItem,
  StorageFileClientItemWithType,
  StorageItemType,
} from '@game-cms/base-core';
import {
  IconButton,
  IndeterminateCircularProgress,
  PreviewIcon,
  useModal,
} from '@game-cms/ui';
import { JSX } from 'react';

import { useClientConfig } from '../../../hooks/useClientConfig.js';
import { FileGroupPreviewModal } from '../FileGroupPreviewModal/index.js';

export type FileGroupPreviewButtonProps<Extra> = {
  className?: string;
  items: StorageClientItem<Extra>[];
};

type BasePreviewButtonProps<PreviewProps> = {
  className?: string;
  previewProps: PreviewProps;
  preview: AsyncFileGroupPreviewRenderer<PreviewProps>;
};

function BasePreviewButton<PreviewProps extends JSX.IntrinsicAttributes>({
  className,
  preview,
  previewProps,
}: BasePreviewButtonProps<PreviewProps>) {
  const showModal = useModal();

  const onClick = () => {
    void showModal(FileGroupPreviewModal<PreviewProps>, {
      preview,
      previewProps,
    });
  };

  return (
    <IconButton className={className} title="Preview" onClick={onClick}>
      <PreviewIcon />
    </IconButton>
  );
}

export function FileGroupPreviewButton<Extra>({
  className,
  items,
}: FileGroupPreviewButtonProps<Extra>) {
  const configResult = useClientConfig();

  if (configResult.status === 'pending') {
    return <IndeterminateCircularProgress className={className} />;
  }

  if (configResult.status === 'success') {
    const config = configResult.value;
    const previews = config.filePreviews?.group ?? [];

    const fileItems = items.filter(
      (item): item is StorageFileClientItemWithType<Extra> =>
        item.type == StorageItemType.FILE
    );

    for (const preview of previews) {
      const props: unknown = preview.test(fileItems);

      if (props !== undefined) {
        return (
          <BasePreviewButton
            className={className}
            preview={preview.renderer}
            previewProps={props}
          />
        );
      }
    }
  }

  return null;
}
