import { GlobalSearch } from '../../../features/global-search';
import { ErrorBoundary } from '../../ui/ErrorBoundary';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <ErrorBoundary fallback={<p role="alert">Search is currently unavailable.</p>}>
          <GlobalSearch />
        </ErrorBoundary>
      </div>
    </header>
  );
}
