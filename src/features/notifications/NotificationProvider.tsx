import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { getNotifications } from '../../api/notificationService';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { AsyncState } from '../../types/asyncState';
import type { Notification } from '../../types/notification';
import { NotificationContext } from './notificationContext';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const loadedState = useAsyncData(getNotifications);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  const notificationState = useMemo<AsyncState<Notification[]>>(() => {
    if (loadedState.status !== 'success') {
      return loadedState;
    }

    return {
      status: 'success',
      data: loadedState.data.map((notification) =>
        readNotificationIds.includes(notification.id)
          ? { ...notification, unread: false }
          : notification,
      ),
    };
  }, [loadedState, readNotificationIds]);

  const markAsRead = useCallback((notificationId: string) => {
    setReadNotificationIds((currentIds) =>
      currentIds.includes(notificationId) ? currentIds : [...currentIds, notificationId],
    );
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
