import { GlobalSearch } from '../../../features/global-search';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <GlobalSearch />
      </div>
    </header>
  );
}
