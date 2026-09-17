import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { useNotifications } from '../notifications';
import { NotificationCenterPanel } from './NotificationCenterPanel';
import { NotificationCenterTrigger } from './NotificationCenterTrigger';
import styles from './NotificationCenter.module.scss';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { markAsRead, notificationState, unreadCount } = useNotifications();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  function closeAndRestoreFocus() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      closeAndRestoreFocus();
    }
  }

  return (
    <div className={styles.notificationCenter} onKeyDown={handleKeyDown} ref={containerRef}>
      <NotificationCenterTrigger
        controlsId={panelId}
        isExpanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        ref={triggerRef}
        unreadCount={unreadCount}
      />
      {isOpen && (
        <NotificationCenterPanel
          id={panelId}
          notificationState={notificationState}
          onClose={closeAndRestoreFocus}
          onMarkAsRead={markAsRead}
          onToggleFilter={() => setShowUnreadOnly((currentValue) => !currentValue)}
          showUnreadOnly={showUnreadOnly}
        />
      )}
    </div>
  );
}
