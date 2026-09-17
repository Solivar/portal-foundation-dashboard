import { forwardRef } from 'react';
import { BellIcon } from '../../components/icons/BellIcon';
import styles from './NotificationCenter.module.scss';

type NotificationCenterTriggerProps = {
  controlsId: string;
  isExpanded: boolean;
  onClick: () => void;
  unreadCount: number;
};

export const NotificationCenterTrigger = forwardRef<
  HTMLButtonElement,
  NotificationCenterTriggerProps
>(function NotificationCenterTrigger({ controlsId, isExpanded, onClick, unreadCount }, ref) {
  const normalizedCount = Math.max(0, Math.floor(unreadCount));
  const badgeLabel = normalizedCount > 99 ? '99+' : String(normalizedCount);
  const accessibleCount = normalizedCount > 99 ? '99 or more' : String(normalizedCount);

  return (
    <button
      aria-controls={controlsId}
      aria-expanded={isExpanded}
      aria-label={`Notifications, ${accessibleCount} unread`}
      className={styles.trigger}
      onClick={onClick}
      ref={ref}
      type="button"
    >
      <BellIcon />
      {normalizedCount > 0 && (
        <span aria-hidden="true" className={styles.badge}>
          {badgeLabel}
        </span>
      )}
    </button>
  );
});
