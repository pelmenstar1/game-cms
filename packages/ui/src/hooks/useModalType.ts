import { useCallback } from 'react';

import { useModal } from './useModal';
import type { ModalComponent, ModalProps } from './useModal/context';

export function useModalType<Props extends ModalProps>(
  component: ModalComponent<Props>
) {
  const showModal = useModal();

  return useCallback(
    (props: Omit<Props, keyof ModalProps>) => showModal(component, props),
    [component, showModal]
  );
}
