import type { Notification } from '../../types/notification';
import { NotificationCenterListItem } from './NotificationCenterListItem';
import styles from './NotificationCenter.module.scss';

type NotificationCenterListProps = {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
};

export function NotificationCenterList({
  notifications,
  onMarkAsRead,
}: NotificationCenterListProps) {
  if (notifications.length === 0) {
    return <p className={styles.statusMessage}>No notifications to display.</p>;
  }

  return (
    <ul className={styles.notificationList}>
      {notifications.map((notification) => (
        <NotificationCenterListItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </ul>
  );
}
