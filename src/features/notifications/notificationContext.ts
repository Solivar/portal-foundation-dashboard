import { createContext, useContext } from 'react';
import type { AsyncState } from '../../types/asyncState';
import type { Notification } from '../../types/notification';

export type NotificationContextValue = {
  notificationState: AsyncState<Notification[]>;
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
};

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider.');
  }

  return context;
}
