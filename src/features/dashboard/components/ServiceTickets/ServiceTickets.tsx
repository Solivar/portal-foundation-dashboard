import { getTickets } from '../../../../api/ticketService';
import { Card } from '../../../../components/ui/Card';
import { useAsyncData } from '../../../../hooks/useAsyncData';
import styles from './ServiceTickets.module.scss';

export function ServiceTickets() {
  const state = useAsyncData(getTickets);

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
