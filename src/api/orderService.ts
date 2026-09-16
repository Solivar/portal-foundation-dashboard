import type { Order } from '../types/order';
import { orderMocks } from '../mocks/orderMocks';
import { delay } from './delay';

const simulateFailure = false;

export async function getOrders(): Promise<Order[]> {
  await delay(500);

  if (simulateFailure) {
    throw new Error('Mock order service failure');
  }

  return orderMocks;
}
