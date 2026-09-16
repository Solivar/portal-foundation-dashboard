import type { Customer } from '../types/customer';
import { customerMock } from '../mocks/customerMock';
import { delay } from './delay';

export async function getCustomer(): Promise<Customer> {
  await delay(400);

  return customerMock;
}
