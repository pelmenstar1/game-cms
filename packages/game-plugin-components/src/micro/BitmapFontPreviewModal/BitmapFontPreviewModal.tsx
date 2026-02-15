import { ModalDialog, ModalProps } from '@game-cms/ui';

import { BitmapFontPreviewController } from '../BitmapFontPreviewController';

export interface BitmapFontPreviewModalProps extends ModalProps {
  texturesUrls: string[];
  atlasUrl: string;
}

export function BitmapFontPreviewModal({
  onClose,
  texturesUrls,
  atlasUrl,
}: BitmapFontPreviewModalProps) {
  return (
    <ModalDialog onClose={onClose}>
      <BitmapFontPreviewController
        texturesUrls={texturesUrls}
        atlasUrl={atlasUrl}
      />
    </ModalDialog>
  );
}
