import { Card } from '../../../../components/ui/Card';
import { useNotifications } from '../../../notifications';
import { NotificationItem } from './NotificationItem';
import styles from './Notifications.module.scss';

export function Notifications() {
  const { notificationState } = useNotifications();
  const notifications =
    notificationState.status === 'success'
      ? notificationState.data.filter((notification) => notification.unread).slice(0, 3)
      : [];

  return (
    <Card>
      <div className={styles.cardHeader}>
        <h2>Notifications</h2>
      </div>
      {notificationState.status === 'loading' && <p>Loading notifications...</p>}
      {notificationState.status === 'error' && <p role="alert">Unable to load notifications.</p>}
      {notificationState.status === 'success' && notifications.length === 0 && (
        <p>No unread notifications.</p>
      )}
      {notificationState.status === 'success' && notifications.length > 0 && (
        <ul className={styles.notificationList}>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </Card>
  );
}
