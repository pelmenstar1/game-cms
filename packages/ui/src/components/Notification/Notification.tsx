import { createContext, ReactNode, useMemo, useState } from 'react';

import { classNames } from '../../utils/classNames';
import { contextUseFactory } from '../../utils/contextFactory';
import { Typography } from '../Typography';
import styles from './Notification.module.scss';

export type NotificationType = 'plain' | 'error';

export type NotificationProps = {
  message: string;
  type: NotificationType;
  isVisible: boolean;
};

export type NotificationWrapperProps = {
  children: ReactNode;
};

export type NotificationManager = {
  show(message: string, type: NotificationType): void;
};

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

  const manager = useMemo(
    (): NotificationManager => ({
      show: (message, type) => {
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
    }),
    []
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
