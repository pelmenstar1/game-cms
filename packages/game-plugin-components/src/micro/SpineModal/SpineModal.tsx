import { ModalDialog, type ModalProps } from '@game-cms/ui';
import type { FC } from 'react';

import { SpineController } from '../SpineController';
import type { SpineData } from '../SpineRenderer/types';

export interface SpineModalProps extends ModalProps {
  spine: SpineData;
}

export const SpineModal: FC<SpineModalProps> = ({ spine, onClose }) => {
  return (
    <ModalDialog onClose={onClose}>
      <SpineController spine={spine} />
    </ModalDialog>
  );
};
