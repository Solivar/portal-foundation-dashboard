import type { ServiceTicket } from '../features/dashboard/dashboard.types';
import { ticketMocks } from '../mocks/ticketMocks';
import { delay } from './delay';

export async function getTickets(): Promise<ServiceTicket[]> {
  await delay(700);

  return ticketMocks;
}
