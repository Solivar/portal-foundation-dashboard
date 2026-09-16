import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { getTickets } from '../../../../api/ticketService';
import { ServiceTickets } from './ServiceTickets';

vi.mock('../../../../api/ticketService', () => ({
  getTickets: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getTickets).mockReset();
});

test('renders service tickets after loading', async () => {
  vi.mocked(getTickets).mockResolvedValue([
    { id: 'TCK-1042', status: 'In progress', priority: 'High' },
  ]);

  render(<ServiceTickets />);

  expect(screen.getByText('Loading service tickets...')).toBeInTheDocument();
  expect(await screen.findByText('TCK-1042')).toBeInTheDocument();
  expect(screen.getByText('In progress')).toBeInTheDocument();
  expect(screen.getByText('High')).toBeInTheDocument();
});

test('renders an error message when service tickets fail to load', async () => {
  vi.mocked(getTickets).mockRejectedValue(new Error('Ticket service failed'));

  render(<ServiceTickets />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load service tickets.');
});
