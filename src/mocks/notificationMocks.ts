import type { Notification } from '../features/dashboard/dashboard.types';

export const notificationMocks: Notification[] = [
  { id: 'notification-1', message: 'Ticket TCK-1042 was updated.', unread: true },
  { id: 'notification-2', message: 'Order ORD-7821 has shipped.', unread: true },
  { id: 'notification-3', message: 'Your support plan was updated.', unread: false },
];
