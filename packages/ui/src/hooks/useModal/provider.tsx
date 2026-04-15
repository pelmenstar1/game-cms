import type { ComponentType, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  type InferModalResult,
  ModalContext,
  type ModalContextType,
  type ModalProps,
  type ShowModalOptions,
} from './context';

type ModalInvocationInfo<Props = object> = {
  component: ComponentType<Props>;
  props: Props;
};

function isModalAlreadyOnScreen<Props>(
  queue: ModalInvocationInfo[],
  component: ComponentType<Props>
) {
  return queue.some((modal) => modal.component === component);
}

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
      props: Omit<Props, keyof ModalProps>,
      options?: ShowModalOptions
    ) => {
      type R = InferModalResult<Props>;

      return new Promise<R>((resolve) => {
        if (
          options?.singleInstance &&
          isModalAlreadyOnScreen(queueRef.current, Component)
        ) {
          return;
        }

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
