import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { getNotifications } from '../../api/notificationService';
import { NotificationProvider } from '../notifications';
import { NotificationCenter } from './NotificationCenter';

vi.mock('../../api/notificationService', () => ({
  getNotifications: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getNotifications).mockReset();
});

test('removes a notification from the unread-only view after marking it as read', async () => {
  vi.mocked(getNotifications).mockResolvedValue([
    { id: 'notification-1', message: 'Unread notification.', unread: true },
    { id: 'notification-2', message: 'Read notification.', unread: false },
  ]);

  render(
    <NotificationProvider>
      <NotificationCenter />
    </NotificationProvider>,
  );

  const trigger = await screen.findByRole('button', { name: 'Notifications, 1 unread' });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole('button', { name: 'Unread Only' }));

  expect(screen.getByText('Unread notification.')).toBeInTheDocument();
  expect(screen.queryByText('Read notification.')).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: 'Mark notification "Unread notification." as read' }),
  );

  expect(screen.queryByText('Unread notification.')).not.toBeInTheDocument();
  expect(screen.getByText('No notifications to display.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Notifications, 0 unread' })).toBeInTheDocument();
});
