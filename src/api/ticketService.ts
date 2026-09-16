import type { ServiceTicket } from '../types/supportTicket';
import { ticketMocks } from '../mocks/ticketMocks';
import { delay } from './delay';

export async function getTickets(): Promise<ServiceTicket[]> {
  await delay(700);

  return ticketMocks;
}

export async function searchTickets(query: string): Promise<ServiceTicket[]> {
  await delay(550);

  const normalizedQuery = query.toLowerCase();

  return ticketMocks.filter((ticket) =>
    [ticket.id, ticket.status, ticket.priority].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  );
}
