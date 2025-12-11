import React, { type ComponentType, type FC } from 'react';

export interface ModalProps {
  onClose?: () => void;
}

export type ModalComponent<Props extends ModalProps = ModalProps> = FC<Props>;

export type ModalContextType = {
  show: <Props extends ModalProps>(
    component: ComponentType<Props>,
    props: Props
  ) => void;
};

export const ModalContext = React.createContext<ModalContextType | null>(null);
