import {
  type ComponentType,
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import React from 'react';

import {
  type InferModalResult,
  ModalContext,
  type ModalContextType,
  type ModalProps,
} from './context';

type ModalInvocationInfo<T = object> = {
  component: FC<T>;
  props: T;
};

export function ModalProvider({ children }: PropsWithChildren) {
  const [currentModal, setCurrentModal] = useState<ModalInvocationInfo>();

  const queueRef = useRef<ModalInvocationInfo[]>([]);

  const onQueueUpdated = useCallback(() => {
    setCurrentModal(queueRef.current[0]);
  }, []);

  const onClose = useCallback(() => {
    queueRef.current.shift();

    onQueueUpdated();
  }, [onQueueUpdated]);

  const show = useMemo(() => {
    return <Props extends ModalProps>(
      Component: ComponentType<Props>,
      props: Omit<Props, keyof ModalProps>
    ) => {
      type R = InferModalResult<Props>;

      return new Promise<R>((resolve) => {
        queueRef.current.unshift({
          component: Component,
          props: {
            ...props,
            onClose: (result: R) => {
              onClose();
              resolve(result);
            },
          },
        } as ModalInvocationInfo);
        onQueueUpdated();
      });
    };
  }, [onClose, onQueueUpdated]);

  const context = useMemo((): ModalContextType => ({ show }), [show]);

  return (
    <ModalContext.Provider value={context}>
      {children}
      {currentModal &&
        React.createElement(currentModal.component, currentModal.props)}
    </ModalContext.Provider>
  );
}
