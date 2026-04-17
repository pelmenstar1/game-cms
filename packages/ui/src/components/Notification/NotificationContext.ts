import { createContext, useContext } from 'react';

import type { ShowNotificationMap } from './types';

export type NotificationContextType = ShowNotificationMap;

export const NotificationContext =
  /*@__PURE__*/ createContext<NotificationContextType>({
    info: () => {},
    error: () => {},
  });

export function useNotification() {
  return useContext(NotificationContext);
}
