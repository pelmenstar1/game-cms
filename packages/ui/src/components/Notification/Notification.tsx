import { type ReactNode, useMemo, useState } from 'react';

import { useCancellableTimeout } from '../../hooks/useCancellableTimeout';
import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './Notification.module.scss';
import {
  NotificationContext,
  type NotificationContextType,
} from './NotificationContext';
import type {
  NotificationContent,
  NotificationState,
  NotificationType,
} from './types';

export type NotificationProps = {
  content: NotificationContent;
  type: NotificationType;
  isVisible: boolean;
};

function getContentDuration(content: NotificationContent) {
  if (typeof content === 'object') {
    return content.duration;
  }
}

export function Notification({ content, type, isVisible }: NotificationProps) {
  const message = typeof content === 'string' ? content : content.message;

  return (
    <div
      className={classNames(
        styles.root,
        !isVisible && styles['root-invisible']
      )}
      role="alert"
    >
      <div
        className={classNames(
          styles['content'],
          styles[`content-type-${type}`]
        )}
      >
        <Typography className={styles['message']}>{message}</Typography>
        {typeof content === 'object' && content.addon}
      </div>
    </div>
  );
}

export type NotificationWrapperProps = {
  children: ReactNode;
};

export function NotificationWrapper({ children }: NotificationWrapperProps) {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>();

  const scheduleTimeout = useCancellableTimeout();

  const manager = useMemo((): NotificationContextType => {
    const show = (state: NotificationState) => {
      setVisible(true);
      setNotification(state);

      const duration = getContentDuration(state.content) ?? 3000;

      scheduleTimeout(() => {
        setVisible(false);

        // Let the animation run for 250 ms
        scheduleTimeout(() => {
          setNotification(undefined);
        }, 250);
      }, duration);
    };

    return {
      info: (content) => {
        show({ content, type: 'info' });
      },
      error: (content) => {
        show({ content, type: 'error' });
      },
    };
  }, [scheduleTimeout]);

  return (
    <NotificationContext.Provider value={manager}>
      {children}
      {notification && <Notification isVisible={isVisible} {...notification} />}
    </NotificationContext.Provider>
  );
}
