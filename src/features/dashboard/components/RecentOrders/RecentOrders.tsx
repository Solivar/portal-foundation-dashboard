import { getOrders } from '../../../../api/orderService';
import { Card } from '../../../../components/ui/Card';
import { useAsyncData } from '../../../../hooks/useAsyncData';
import styles from './RecentOrders.module.scss';

export function RecentOrders() {
  const state = useAsyncData(getOrders);

  return (
    <Card>
      <div className={styles.cardHeader}>
        <h2>Recent orders</h2>
      </div>
      {state.status === 'loading' && <p>Loading recent orders...</p>}
      {state.status === 'error' && <p role="alert">Unable to load recent orders.</p>}
      {state.status === 'success' && (
        <div className={styles.ordersTableWrapper}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Total</th>
                <th scope="col">Shipment</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((order) => (
                <tr key={order.number}>
                  <td>{order.number}</td>
                  <td>{order.total}</td>
                  <td>{order.shipmentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
