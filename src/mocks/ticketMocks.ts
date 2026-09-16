import type { ServiceTicket } from '../types/supportTicket';

export const ticketMocks: ServiceTicket[] = [
  { id: 'TCK-1042', status: 'In progress', priority: 'High' },
  { id: 'TCK-1038', status: 'Waiting for customer', priority: 'Medium' },
  { id: 'TCK-1029', status: 'Open', priority: 'Low' },
];
