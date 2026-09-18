import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { getNotifications } from '../../api/notificationService';
import type { AsyncState } from '../../types/asyncState';
import type { Notification } from '../../types/notification';
import { NotificationContext } from './notificationContext';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notificationState, setNotificationState] = useState<AsyncState<Notification[]>>({
    status: 'loading',
  });

  useEffect(() => {
    let isActive = true;

    async function loadNotifications() {
      try {
        const notifications = await getNotifications();

        if (!Array.isArray(notifications)) {
          throw new TypeError('Invalid notifications response.');
        }

        if (isActive) {
          setNotificationState({ status: 'success', data: notifications });
        }
      } catch (error) {
        if (isActive) {
          setNotificationState({ status: 'error', error });
        }
      }
    }

    void loadNotifications();

    return () => {
      isActive = false;
    };
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotificationState((currentState) => {
      if (currentState.status !== 'success') {
        return currentState;
      }

      return {
        status: 'success',
        data: currentState.data.map((notification) =>
          notification.id === notificationId ? { ...notification, unread: false } : notification,
        ),
      };
    });
  }, []);

  const unreadCount =
    notificationState.status === 'success'
      ? notificationState.data.filter((notification) => notification.unread).length
      : 0;

  const value = useMemo(
    () => ({ notificationState, unreadCount, markAsRead }),
    [notificationState, unreadCount, markAsRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
