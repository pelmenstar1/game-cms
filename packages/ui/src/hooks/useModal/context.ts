import React, { type FC } from 'react';

export interface ModalProps<T = undefined> {
  onClose: (result: T) => void;
}

export type ModalComponent<Props extends ModalProps = ModalProps> = FC<Props>;

export type InferModalResult<Props> =
  Props extends ModalProps<infer T> ? T : never;

export type ShowModalFn = <Props extends ModalProps>(
  component: FC<Props>,
  props: Omit<Props, keyof ModalProps>
) => Promise<InferModalResult<Props>>;

export type ModalContextType = {
  show: ShowModalFn;
};

export const ModalContext = React.createContext<ModalContextType | null>(null);
