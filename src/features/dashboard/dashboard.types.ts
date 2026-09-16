export type Customer = {
  name: string;
  email: string;
  organization: string;
};

export type ServiceTicket = {
  id: string;
  status: string;
  priority: string;
};

export type Order = {
  number: string;
  total: string;
  shipmentStatus: string;
};

export type Notification = {
  id: string;
  message: string;
  unread: boolean;
};
