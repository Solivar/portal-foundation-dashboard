import { useEffect, useState } from 'react';
import { getNotifications } from '../../../../api/notificationService';
import { Card } from '../../../../components/ui/Card';
import type { AsyncState, Notification } from '../../dashboard.types';
import styles from './Notifications.module.scss';

export function Notifications() {
  const [state, setState] = useState<AsyncState<Notification[]>>({ status: 'loading' });

  useEffect(() => {
    let isActive = true;

    getNotifications().then(
      (notifications) => {
        if (isActive) setState({ status: 'success', data: notifications });
      },
      () => {
        if (isActive) setState({ status: 'error' });
      },
    );

    return () => {
      isActive = false;
    };
  }, []);

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
            <li
              className={`${styles.notificationItem} ${
                notification.unread ? styles.unread : styles.read
              }`}
              key={notification.id}
            >
              <span className={styles.notificationContent}>
                <span
                  className={`${styles.notificationIndicator} ${
                    notification.unread ? styles.unreadIndicator : styles.readIndicator
                  }`}
                  aria-hidden="true"
                />
                <span>{notification.message}</span>
              </span>
              <span className={notification.unread ? styles.unreadFlag : styles.readFlag}>
                {notification.unread ? 'Unread' : 'Read'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
