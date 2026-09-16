import type { Notification } from '../types/notification';
import { notificationMocks } from '../mocks/notificationMocks';
import { delay } from './delay';

export async function getNotifications(): Promise<Notification[]> {
  await delay(600);

  return notificationMocks;
}
