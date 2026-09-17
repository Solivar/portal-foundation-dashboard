import type { Notification } from '../types/notification';

export const notificationMocks: Notification[] = [
  { id: 'notification-1', message: 'Ticket TCK-1042 was updated.', unread: true },
  { id: 'notification-2', message: 'Order ORD-7821 has shipped.', unread: true },
  { id: 'notification-3', message: 'Your support plan was updated.', unread: false },
  { id: 'notification-4', message: 'Ticket TCK-1038 is waiting for your response.', unread: true },
  { id: 'notification-5', message: 'Order ORD-7798 is being processed.', unread: false },
  { id: 'notification-6', message: 'A new knowledge article is available.', unread: true },
];
