import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { getNotifications } from '../../../../api/notificationService';
import { Notifications } from './Notifications';

vi.mock('../../../../api/notificationService', () => ({
  getNotifications: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getNotifications).mockReset();
});

test('renders notifications after loading', async () => {
  vi.mocked(getNotifications).mockResolvedValue([
    {
      id: 'notification-1',
      message: 'Ticket TCK-1042 was updated.',
      unread: true,
    },
    {
      id: 'notification-2',
      message: 'Your support plan was updated.',
      unread: false,
    },
  ]);

  render(<Notifications />);

  expect(screen.getByText('Loading notifications...')).toBeInTheDocument();
  expect(await screen.findByText('Ticket TCK-1042 was updated.')).toBeInTheDocument();
  expect(screen.getByText('Your support plan was updated.')).toBeInTheDocument();
  expect(screen.getByText('Unread')).toBeInTheDocument();
  expect(screen.getByText('Read')).toBeInTheDocument();
});

test('renders an error message when notifications fail to load', async () => {
  vi.mocked(getNotifications).mockRejectedValue(new Error('Notification service failed'));

  render(<Notifications />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load notifications.');
});
