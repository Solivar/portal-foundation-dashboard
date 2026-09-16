import { Grid, GridItem } from '../../components/ui/Grid';
import { CustomerInformation } from './components/CustomerInformation';
import { Notifications } from './components/Notifications';
import { RecentOrders } from './components/RecentOrders';
import { ServiceTickets } from './components/ServiceTickets';
import styles from './Dashboard.module.scss';

export function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <Grid>
        <GridItem span={12} as="section">
          <CustomerInformation />
        </GridItem>

        <GridItem span={6} as="section">
          <ServiceTickets />
        </GridItem>

        <GridItem span={6} as="section">
          <RecentOrders />
        </GridItem>

        <GridItem span={12} as="section">
          <Notifications />
        </GridItem>
      </Grid>
    </main>
  );
}
