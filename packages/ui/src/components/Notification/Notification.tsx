import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { classNames } from '../../utils/classNames';
import { contextUseFactory } from '../../utils/contextFactory';
import { Typography } from '../Typography';
import styles from './Notification.module.scss';

export type NotificationType = 'info' | 'error';

export type NotificationProps = {
  message: string;
  type: NotificationType;
  isVisible: boolean;
};

export type NotificationWrapperProps = {
  children: ReactNode;
};

type SendMessages = Record<NotificationType, (message: string) => void>;

export type NotificationManager = SendMessages;

export const NotificationContext =
  /*@__PURE__*/ createContext<NotificationManager | null>(null);

export function Notification({ message, type, isVisible }: NotificationProps) {
  return (
    <div
      className={classNames(
        styles.root,
        !isVisible && styles['root-invisible']
      )}
      role="alert"
    >
      <Typography className={styles[`text-type-${type}`]}>{message}</Typography>
    </div>
  );
}

export function NotificationWrapper({ children }: NotificationWrapperProps) {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  }>();

  const showNotification = useCallback(
    (message: string, type: NotificationType) => {
      setVisible(true);
      setNotification({ message, type });

      setTimeout(() => {
        setVisible(false);

        // Let the animation run for 250 ms
        setTimeout(() => {
          setNotification(undefined);
        }, 250);
      }, 3000);
    },
    []
  );

  const manager = useMemo(
    (): NotificationManager => ({
      info: (message) => {
        showNotification(message, 'info');
      },
      error: (message) => {
        showNotification(message, 'error');
      },
    }),
    [showNotification]
  );

  return (
    <NotificationContext.Provider value={manager}>
      {children}
      {notification && <Notification isVisible={isVisible} {...notification} />}
    </NotificationContext.Provider>
  );
}

export const useNotification = /*@__PURE__*/ contextUseFactory(
  NotificationContext,
  'NotificationContext'
);
