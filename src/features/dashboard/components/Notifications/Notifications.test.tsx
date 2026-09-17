import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { useNotifications } from '../../../notifications';
import { Notifications } from './Notifications';

vi.mock('../../../notifications', () => ({
  useNotifications: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useNotifications).mockReset();
});

test('renders the loading state', () => {
  vi.mocked(useNotifications).mockReturnValue({
    notificationState: { status: 'loading' },
    unreadCount: 0,
    markAsRead: vi.fn(),
  });

  render(<Notifications />);

  expect(screen.getByText('Loading notifications...')).toBeInTheDocument();
});

test('renders only the first three unread notifications', () => {
  vi.mocked(useNotifications).mockReturnValue({
    notificationState: {
      status: 'success',
      data: [
        { id: 'notification-1', message: 'First unread notification.', unread: true },
        { id: 'notification-2', message: 'Read notification.', unread: false },
        { id: 'notification-3', message: 'Second unread notification.', unread: true },
        { id: 'notification-4', message: 'Third unread notification.', unread: true },
        { id: 'notification-5', message: 'Fourth unread notification.', unread: true },
      ],
    },
    unreadCount: 4,
    markAsRead: vi.fn(),
  });

  render(<Notifications />);

  expect(screen.getByText('First unread notification.')).toBeInTheDocument();
  expect(screen.getByText('Second unread notification.')).toBeInTheDocument();
  expect(screen.getByText('Third unread notification.')).toBeInTheDocument();
  expect(screen.queryByText('Read notification.')).not.toBeInTheDocument();
  expect(screen.queryByText('Fourth unread notification.')).not.toBeInTheDocument();
  expect(screen.getAllByText('Unread')).toHaveLength(3);
});

test('renders an empty message when there are no unread notifications', () => {
  vi.mocked(useNotifications).mockReturnValue({
    notificationState: {
      status: 'success',
      data: [{ id: 'notification-1', message: 'Read notification.', unread: false }],
    },
    unreadCount: 0,
    markAsRead: vi.fn(),
  });

  render(<Notifications />);

  expect(screen.getByText('No unread notifications.')).toBeInTheDocument();
  expect(screen.queryByText('Read notification.')).not.toBeInTheDocument();
});

test('renders an error message when notifications fail to load', () => {
  vi.mocked(useNotifications).mockReturnValue({
    notificationState: { status: 'error', error: new Error('Notification service failed') },
    unreadCount: 0,
    markAsRead: vi.fn(),
  });

  render(<Notifications />);

  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load notifications.');
});
