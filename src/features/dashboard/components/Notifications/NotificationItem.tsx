import type { Notification } from '../../dashboard.types';
import styles from './Notifications.module.scss';

type NotificationItemProps = {
  notification: Notification;
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const itemClassName = `${styles.notificationItem} ${
    notification.unread ? styles.unread : styles.read
  }`;
  const indicatorClassName = `${styles.notificationIndicator} ${
    notification.unread ? styles.unreadIndicator : styles.readIndicator
  }`;
  const statusClassName = notification.unread ? styles.unreadFlag : styles.readFlag;
  const statusLabel = notification.unread ? 'Unread' : 'Read';

  return (
    <li className={itemClassName}>
      <span className={styles.notificationContent}>
        <span className={indicatorClassName} aria-hidden="true" />
        <span>{notification.message}</span>
      </span>
      <span className={statusClassName}>{statusLabel}</span>
    </li>
  );
}
