import type { Order } from '../types/order';

export const orderMocks: Order[] = [
  { number: 'ORD-7821', total: '€1,240.00', shipmentStatus: 'Shipped' },
  { number: 'ORD-7798', total: '€680.50', shipmentStatus: 'Processing' },
  { number: 'ORD-7754', total: '€315.00', shipmentStatus: 'Delivered' },
];
