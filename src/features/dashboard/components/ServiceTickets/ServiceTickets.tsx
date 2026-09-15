import { useEffect, useState } from 'react';
import { getTickets } from '../../../../api/ticketService';
import { Card } from '../../../../components/ui/Card';
import type { AsyncState, ServiceTicket } from '../../dashboard.types';
import styles from './ServiceTickets.module.scss';

export function ServiceTickets() {
  const [state, setState] = useState<AsyncState<ServiceTicket[]>>({ status: 'loading' });

  useEffect(() => {
    let isActive = true;

    getTickets().then(
      (tickets) => {
        if (isActive) setState({ status: 'success', data: tickets });
      },
      () => {
        if (isActive) setState({ status: 'error' });
      },
    );

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Card>
      <div className={styles.cardHeader}>
        <h2>Open service tickets</h2>
      </div>
      {state.status === 'loading' && <p>Loading service tickets...</p>}
      {state.status === 'error' && <p role="alert">Unable to load service tickets.</p>}
      {state.status === 'success' && (
        <div className={styles.ticketsTableWrapper}>
          <table className={styles.ticketsTable}>
            <thead>
              <tr>
                <th scope="col">Ticket</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
