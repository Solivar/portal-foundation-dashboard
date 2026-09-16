import styles from './GlobalSearch.module.scss';

type SearchResultGroupProps<T> = {
  heading: string;
  headingId: string;
  items: T[];
  getKey: (item: T) => string;
  getTitle: (item: T) => string;
  getDescription: (item: T) => string;
};

export function SearchResultGroup<T>({
  heading,
  headingId,
  items,
  getKey,
  getTitle,
  getDescription,
}: SearchResultGroupProps<T>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.resultGroup} aria-labelledby={headingId}>
      <h2 className={styles.groupTitle} id={headingId}>
        {heading}
      </h2>
      <ul className={styles.resultList}>
        {items.map((item) => (
          <li className={styles.resultItem} key={getKey(item)}>
            <span className={styles.resultTitle}>{getTitle(item)}</span>
            <span className={styles.resultMeta}>{getDescription(item)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
