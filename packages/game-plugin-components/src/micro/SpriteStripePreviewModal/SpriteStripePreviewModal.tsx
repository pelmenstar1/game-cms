import { ModalDialog, ModalProps } from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { SpriteStripePreview } from '../SpriteStripePreview';
import { SpriteStripeInfo } from '../SpriteStripePreview/types';

export type SpriteStripePreviewModalProps = ModalProps & SpriteStripeInfo;

export function SpriteStripePreviewModal({
  imageUrl,
  frameWidth,
  frameHeight,
  onClose,
}: SpriteStripePreviewModalProps) {
  const { t } = useTranslation('game');

  return (
    <ModalDialog title={t('common.preview')} onClose={onClose}>
      <SpriteStripePreview
        imageUrl={imageUrl}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
      />
    </ModalDialog>
  );
}
