import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { getOrders } from '../../../../api/orderService';
import { RecentOrders } from './RecentOrders';

vi.mock('../../../../api/orderService', () => ({
  getOrders: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getOrders).mockReset();
});

test('renders recent orders after loading', async () => {
  vi.mocked(getOrders).mockResolvedValue([
    { number: 'ORD-1001', total: '€120.00', shipmentStatus: 'Shipped' },
  ]);

  render(<RecentOrders />);

  expect(screen.getByText('Loading recent orders...')).toBeInTheDocument();
  expect(await screen.findByText('ORD-1001')).toBeInTheDocument();
  expect(screen.getByText('€120.00')).toBeInTheDocument();
  expect(screen.getByText('Shipped')).toBeInTheDocument();
});

test('renders an error message when recent orders fail to load', async () => {
  vi.mocked(getOrders).mockRejectedValue(new Error('Order service failed'));

  render(<RecentOrders />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load recent orders.');
});
