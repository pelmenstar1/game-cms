import { createContextHook } from '../../utils/hookContext';
import { ModalContext } from './context';
import { ModalProvider } from './provider';

export * from './context';

export const useModal = createContextHook(
  ModalContext,
  ModalProvider,
  (context) => context.show
);
