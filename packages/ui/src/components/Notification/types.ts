import type { ReactNode } from 'react';

export type NotificationType = 'info' | 'error';

export type NotificationContent =
  | string
  | {
      message: string;
      duration?: number;
      addon?: ReactNode;
    };

export type NotificationState = {
  type: NotificationType;
  content: NotificationContent;
};

export type ShowNotificationFn = (content: NotificationContent) => void;
export type ShowNotificationMap = Record<NotificationType, ShowNotificationFn>;
