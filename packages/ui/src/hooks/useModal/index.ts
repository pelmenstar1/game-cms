import { useContext } from 'react';

import { ModalContext } from './context';

export * from './context';
export * from './provider';

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal provider is not in the tree');
  }

  return context.show;
}
