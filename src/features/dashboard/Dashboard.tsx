import { CustomerInformation } from './components/CustomerInformation';
import { Notifications } from './components/Notifications';
import { RecentOrders } from './components/RecentOrders';
import { ServiceTickets } from './components/ServiceTickets';
import styles from './Dashboard.module.scss';

export function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <div className={styles.dashboardGrid}>
        <section className={styles.colSpanFull}>
          <CustomerInformation />
        </section>

        <section className={styles.colSpan6}>
          <ServiceTickets />
        </section>

        <section className={styles.colSpan6}>
          <RecentOrders />
        </section>

        <section className={styles.colSpanFull}>
          <Notifications />
        </section>
      </div>
    </main>
  );
}
