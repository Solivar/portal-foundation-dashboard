import { useEffect, useState } from 'react';
import { getCustomer } from '../../../../api/customerService';
import { Card } from '../../../../components/ui/Card';
import type { AsyncState, Customer } from '../../dashboard.types';
import styles from './CustomerInformation.module.scss';

export function CustomerInformation() {
  const [state, setState] = useState<AsyncState<Customer>>({ status: 'loading' });

  useEffect(() => {
    let isActive = true;

    getCustomer().then(
      (customer) => {
        if (isActive) setState({ status: 'success', data: customer });
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
        <h2>Customer information</h2>
      </div>
      {state.status === 'loading' && <p>Loading customer information...</p>}
      {state.status === 'error' && <p role="alert">Unable to load customer information.</p>}
      {state.status === 'success' && (
        <dl className={styles.customerDetails}>
          <div>
            <dt>Name</dt>
            <dd>{state.data.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{state.data.email}</dd>
          </div>
          <div>
            <dt>Organization</dt>
            <dd>{state.data.organization}</dd>
          </div>
        </dl>
      )}
    </Card>
  );
}
