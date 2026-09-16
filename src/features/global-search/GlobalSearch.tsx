import { type ChangeEvent, type FocusEvent, type SubmitEvent, useId, useState } from 'react';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { SearchResults } from './SearchResults';
import { useGlobalSearch } from './useGlobalSearch';
import styles from './GlobalSearch.module.scss';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const resultsId = useId();
  const state = useGlobalSearch(query);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  }

  return (
    <form
      className={styles.search}
      role="search"
      onBlur={handleBlur}
      onFocus={() => setIsFocused(true)}
      onSubmit={handleSubmit}
    >
      <div className={styles.inputWrapper}>
        <input
          aria-label="Global search"
          aria-controls={resultsId}
          className={styles.input}
          id="global-search"
          onChange={handleChange}
          placeholder="Search products, articles, and tickets"
          type="search"
          value={query}
        />
        <span className={styles.searchIcon} aria-hidden="true">
          <SearchIcon />
        </span>
      </div>
      {isFocused && (
        <div aria-live="polite" className={styles.resultsPanel} id={resultsId}>
          {state.status === 'idle' && (
            <p className={styles.statusMessage}>Search products, articles, and tickets.</p>
          )}
          {state.status === 'loading' && <p className={styles.statusMessage}>Searching...</p>}
          {state.status === 'error' && (
            <p className={styles.statusMessage} role="alert">
              Unable to complete search.
            </p>
          )}
          {state.status === 'success' && <SearchResults results={state.data} />}
        </div>
      )}
    </form>
  );
}
