import { getNotifications } from '../../../../api/notificationService';
import { Card } from '../../../../components/ui/Card';
import { useAsyncData } from '../../../../hooks/useAsyncData';
import { NotificationItem } from './NotificationItem';
import styles from './Notifications.module.scss';

export function Notifications() {
  const state = useAsyncData(getNotifications);

  return (
    <Card>
      <div className={styles.cardHeader}>
        <h2>Notifications</h2>
      </div>
      {state.status === 'loading' && <p>Loading notifications...</p>}
      {state.status === 'error' && <p role="alert">Unable to load notifications.</p>}
      {state.status === 'success' && (
        <ul className={styles.notificationList}>
          {state.data.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </Card>
  );
}
