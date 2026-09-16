import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { Dashboard } from './Dashboard';

vi.mock('./components/CustomerInformation', () => ({
  CustomerInformation: () => <div>Customer information loaded</div>,
}));

vi.mock('./components/ServiceTickets', () => ({
  ServiceTickets: () => <div>Service tickets loaded</div>,
}));

vi.mock('./components/RecentOrders', () => ({
  RecentOrders: () => <div>Recent orders loaded</div>,
}));

vi.mock('./components/Notifications', () => ({
  Notifications: () => {
    throw new Error('Broken notifications');
  },
}));

test('keeps the dashboard visible when one widget crashes', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  render(<Dashboard />);

  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.getByText('Customer information loaded')).toBeInTheDocument();
  expect(screen.getByText('Service tickets loaded')).toBeInTheDocument();
  expect(screen.getByText('Recent orders loaded')).toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to display notifications.');

  consoleError.mockRestore();
});
