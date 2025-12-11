import {
  type ComponentType,
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ModalContext,
  type ModalContextType,
  type ModalProps,
} from './context';

export function ModalProvider({ children }: PropsWithChildren) {
  const [CurrentModal, setCurrentModal] = useState<FC>();
  const queueRef = useRef<FC[]>([]);

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
      props: Props
    ) => {
      queueRef.current.push(() => <Component {...props} onClose={onClose} />);
    };
  }, [onClose]);

  const context = useMemo((): ModalContextType => ({ show }), [show]);

  return (
    <ModalContext.Provider value={context}>
      {children}
      {CurrentModal && <CurrentModal />}
    </ModalContext.Provider>
  );
}
