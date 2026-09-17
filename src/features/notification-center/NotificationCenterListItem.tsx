import { Button } from '../../components/ui/Button';
import type { Notification } from '../../types/notification';
import styles from './NotificationCenter.module.scss';

type NotificationCenterListItemProps = {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
};

export function NotificationCenterListItem({
  notification,
  onMarkAsRead,
}: NotificationCenterListItemProps) {
  const itemClassName = `${styles.notificationItem} ${
    notification.unread ? styles.unreadNotification : styles.readNotification
  }`;

  return (
    <li className={itemClassName}>
      <p className={styles.notificationMessage}>{notification.message}</p>
      <div className={styles.notificationFooter}>
        <span className={styles.notificationStatus}>{notification.unread ? 'Unread' : 'Read'}</span>
        {notification.unread && (
          <Button
            aria-label={`Mark notification "${notification.message}" as read`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as read
          </Button>
        )}
      </div>
    </li>
  );
}
