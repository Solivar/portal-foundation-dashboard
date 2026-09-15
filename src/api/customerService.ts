import type { Customer } from '../features/dashboard/dashboard.types';
import { customerMock } from '../mocks/customerMock';
import { delay } from './delay';

export async function getCustomer(): Promise<Customer> {
  await delay(400);

  return customerMock;
}
