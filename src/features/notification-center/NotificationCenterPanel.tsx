import { CloseIcon } from '../../components/icons/CloseIcon';
import { Button } from '../../components/ui/Button';
import type { Notification } from '../../types/notification';
import type { AsyncState } from '../../types/asyncState';
import { NotificationCenterList } from './NotificationCenterList';
import styles from './NotificationCenter.module.scss';

type NotificationCenterPanelProps = {
  id: string;
  notificationState: AsyncState<Notification[]>;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onToggleFilter: () => void;
  showUnreadOnly: boolean;
};

export function NotificationCenterPanel({
  id,
  notificationState,
  onClose,
  onMarkAsRead,
  onToggleFilter,
  showUnreadOnly,
}: NotificationCenterPanelProps) {
  const headingId = `${id}-heading`;
  const visibleNotifications =
    notificationState.status === 'success' && showUnreadOnly
      ? notificationState.data.filter((notification) => notification.unread)
      : notificationState.status === 'success'
        ? notificationState.data
        : [];

  return (
    <section aria-labelledby={headingId} className={styles.panel} id={id}>
      <div className={styles.panelHeader}>
        <h2 id={headingId}>Notifications</h2>
        <button
          aria-label="Close notifications"
          className={styles.closeButton}
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>
      </div>
      <div className={styles.panelControls}>
        <Button onClick={onToggleFilter}>
          {showUnreadOnly ? 'All Notifications' : 'Unread Only'}
        </Button>
      </div>
      {notificationState.status === 'loading' && (
        <p className={styles.statusMessage}>Loading notifications...</p>
      )}
      {notificationState.status === 'error' && (
        <p className={styles.statusMessage} role="alert">
          Unable to load notifications.
        </p>
      )}
      {notificationState.status === 'success' && (
        <NotificationCenterList notifications={visibleNotifications} onMarkAsRead={onMarkAsRead} />
      )}
    </section>
  );
}
