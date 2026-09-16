import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { getCustomer } from '../../../../api/customerService';
import { CustomerInformation } from './CustomerInformation';

vi.mock('../../../../api/customerService', () => ({
  getCustomer: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getCustomer).mockReset();
});

test('renders customer information after loading', async () => {
  vi.mocked(getCustomer).mockResolvedValue({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    organization: 'Northwind Services',
  });

  render(<CustomerInformation />);

  expect(screen.getByText('Loading customer information...')).toBeInTheDocument();
  expect(await screen.findByText('Alex Morgan')).toBeInTheDocument();
  expect(screen.getByText('alex.morgan@example.com')).toBeInTheDocument();
  expect(screen.getByText('Northwind Services')).toBeInTheDocument();
});

test('renders an error message when customer information fails to load', async () => {
  vi.mocked(getCustomer).mockRejectedValue(new Error('Customer service failed'));

  render(<CustomerInformation />);

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Unable to load customer information.',
  );
});
