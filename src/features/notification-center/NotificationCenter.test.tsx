import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { useNotifications } from '../notifications';
import { NotificationCenter } from './NotificationCenter';

vi.mock('../notifications', () => ({
  useNotifications: vi.fn(),
}));

const markAsRead = vi.fn();
const notifications = [
  { id: 'notification-1', message: 'Unread notification.', unread: true },
  { id: 'notification-2', message: 'Read notification.', unread: false },
];

function openPanel() {
  const trigger = screen.getByRole('button', { name: /Notifications/ });
  fireEvent.click(trigger);

  return trigger;
}

beforeEach(() => {
  markAsRead.mockReset();
  vi.mocked(useNotifications)
    .mockReset()
    .mockReturnValue({
      notificationState: { status: 'success', data: notifications },
      unreadCount: 1,
      markAsRead,
    });
});

test('opens the notification panel from the trigger', () => {
  render(<NotificationCenter />);
  const trigger = screen.getByRole('button', { name: /Notifications/ });

  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
});

test('closes the panel when the user clicks outside it', () => {
  render(
    <>
      <NotificationCenter />
      <button type="button">Outside control</button>
    </>,
  );
  openPanel();

  fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside control' }));

  expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();
});

test('closes the panel with its close button and restores trigger focus', () => {
  render(<NotificationCenter />);
  const trigger = openPanel();

  fireEvent.click(screen.getByRole('button', { name: 'Close notifications' }));

  expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('closes the panel with Escape and restores trigger focus', () => {
  render(<NotificationCenter />);
  const trigger = openPanel();
  const closeButton = screen.getByRole('button', { name: 'Close notifications' });
  act(() => closeButton.focus());

  fireEvent.keyDown(closeButton, { key: 'Escape' });

  expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('shows read and unread notifications with actions only for unread items', () => {
  render(<NotificationCenter />);
  openPanel();

  expect(screen.getByText('Unread notification.')).toBeInTheDocument();
  expect(screen.getByText('Read notification.')).toBeInTheDocument();
  expect(screen.getByText('Unread')).toBeInTheDocument();
  expect(screen.getByText('Read')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Mark notification "Unread notification." as read' }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Mark notification "Read notification." as read' }),
  ).not.toBeInTheDocument();
});

test('switches between all notifications and unread notifications', () => {
  render(<NotificationCenter />);
  openPanel();

  fireEvent.click(screen.getByRole('button', { name: 'Unread Only' }));

  expect(screen.getByText('Unread notification.')).toBeInTheDocument();
  expect(screen.queryByText('Read notification.')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'All Notifications' }));

  expect(screen.getByText('Read notification.')).toBeInTheDocument();
});

test('passes the selected notification to the mark-as-read action', () => {
  render(<NotificationCenter />);
  openPanel();

  fireEvent.click(
    screen.getByRole('button', { name: 'Mark notification "Unread notification." as read' }),
  );

  expect(markAsRead).toHaveBeenCalledWith('notification-1');
});

test('shows loading, error, and empty states', () => {
  vi.mocked(useNotifications).mockReturnValue({
    notificationState: { status: 'loading' },
    unreadCount: 0,
    markAsRead,
  });
  const { rerender } = render(<NotificationCenter />);
  openPanel();
  expect(screen.getByText('Loading notifications...')).toBeInTheDocument();

  vi.mocked(useNotifications).mockReturnValue({
    notificationState: { status: 'error', error: new Error('Failed') },
    unreadCount: 0,
    markAsRead,
  });
  rerender(<NotificationCenter />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load notifications.');

  vi.mocked(useNotifications).mockReturnValue({
    notificationState: { status: 'success', data: [] },
    unreadCount: 0,
    markAsRead,
  });
  rerender(<NotificationCenter />);
  expect(screen.getByText('No notifications to display.')).toBeInTheDocument();
});
