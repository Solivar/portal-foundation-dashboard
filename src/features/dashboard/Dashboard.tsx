import { Card } from '../../components/ui/Card';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
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
          <ErrorBoundary
            fallback={<DashboardSectionError message="Unable to display customer information." />}
          >
            <CustomerInformation />
          </ErrorBoundary>
        </GridItem>

        <GridItem span={6} as="section">
          <ErrorBoundary
            fallback={<DashboardSectionError message="Unable to display service tickets." />}
          >
            <ServiceTickets />
          </ErrorBoundary>
        </GridItem>

        <GridItem span={6} as="section">
          <ErrorBoundary
            fallback={<DashboardSectionError message="Unable to display recent orders." />}
          >
            <RecentOrders />
          </ErrorBoundary>
        </GridItem>

        <GridItem span={12} as="section">
          <ErrorBoundary
            fallback={<DashboardSectionError message="Unable to display notifications." />}
          >
            <Notifications />
          </ErrorBoundary>
        </GridItem>
      </Grid>
    </main>
  );
}

function DashboardSectionError({ message }: { message: string }) {
  return (
    <Card>
      <p role="alert">{message}</p>
    </Card>
  );
}
