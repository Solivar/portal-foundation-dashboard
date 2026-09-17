import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type SubmitEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { SearchResults } from './SearchResults';
import { useGlobalSearch } from './useGlobalSearch';
import styles from './GlobalSearch.module.scss';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const state = useGlobalSearch(query);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setIsOpen(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      inputRef.current?.focus();
      setIsOpen(false);
    }
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && !event.currentTarget.contains(nextTarget)) {
      setIsOpen(false);
    }
  }

  return (
    <form
      className={styles.search}
      role="search"
      onBlur={handleBlur}
      onFocus={() => setIsOpen(true)}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      ref={searchRef}
    >
      <div className={styles.inputWrapper}>
        <input
          aria-label="Global search"
          aria-controls={resultsId}
          className={styles.input}
          id="global-search"
          onChange={handleChange}
          placeholder="Search products, articles, and tickets"
          ref={inputRef}
          type="search"
          value={query}
        />
        <span className={styles.searchIcon} aria-hidden="true">
          <SearchIcon />
        </span>
      </div>
      {isOpen && (
        <section
          aria-label="Search results"
          aria-live="polite"
          className={styles.resultsPanel}
          id={resultsId}
          tabIndex={0}
        >
          {state.status === 'idle' && (
            <p className={styles.statusMessage}>Start typing and results will appear here.</p>
          )}
          {state.status === 'loading' && <p className={styles.statusMessage}>Searching...</p>}
          {state.status === 'error' && (
            <p className={styles.statusMessage} role="alert">
              Unable to complete search.
            </p>
          )}
          {state.status === 'success' && (
            <ErrorBoundary
              fallback={
                <p className={styles.statusMessage} role="alert">
                  Unable to display search results.
                </p>
              }
            >
              <SearchResults results={state.data} />
            </ErrorBoundary>
          )}
        </section>
      )}
    </form>
  );
}
