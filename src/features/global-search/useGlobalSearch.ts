import { useEffect, useRef, useState } from 'react';
import { searchKnowledgeArticles } from '../../api/knowledgeArticleService';
import { searchProducts } from '../../api/productService';
import { searchTickets } from '../../api/ticketService';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { AsyncState } from '../../types/asyncState';
import { GLOBAL_SEARCH_DEBOUNCE_DELAY_MS } from './globalSearch.constants';
import type { GlobalSearchResults } from './globalSearch.types';

type GlobalSearchState = { status: 'idle' } | AsyncState<GlobalSearchResults>;
type StoredSearchState = {
  query: string;
  state: AsyncState<GlobalSearchResults>;
};

async function searchGlobalSources(query: string): Promise<GlobalSearchResults> {
  const [products, knowledgeArticles, supportTickets] = await Promise.all([
    searchProducts(query),
    searchKnowledgeArticles(query),
    searchTickets(query),
  ]);

  return {
    products,
    knowledgeArticles,
    supportTickets,
  };
}

function getNextRequestId(requestIdRef: React.RefObject<number>) {
  const requestId = requestIdRef.current + 1;
  requestIdRef.current = requestId;

  return requestId;
}

function isLatestActiveRequest(isActive: boolean, requestId: number, latestRequestId: number) {
  return isActive && requestId === latestRequestId;
}

function getVisibleSearchState(
  query: string,
  debouncedQuery: string,
  storedState: StoredSearchState | null,
): GlobalSearchState {
  if (!query) {
    return { status: 'idle' };
  }

  if (storedState?.query === debouncedQuery) {
    return storedState.state;
  }

  return { status: 'loading' };
}

export function useGlobalSearch(query: string): GlobalSearchState {
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, GLOBAL_SEARCH_DEBOUNCE_DELAY_MS);
  const requestIdRef = useRef(0);
  const [storedState, setStoredState] = useState<StoredSearchState | null>(null);

  useEffect(() => {
    if (!trimmedQuery) {
      requestIdRef.current += 1;
    }
  }, [trimmedQuery]);

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    let isActive = true;
    const requestId = getNextRequestId(requestIdRef);

    async function runSearch() {
      try {
        const data = await searchGlobalSources(debouncedQuery);

        if (isLatestActiveRequest(isActive, requestId, requestIdRef.current)) {
          setStoredState({
            query: debouncedQuery,
            state: {
              status: 'success',
              data,
            },
          });
        }
      } catch (error) {
        if (isLatestActiveRequest(isActive, requestId, requestIdRef.current)) {
          setStoredState({
            query: debouncedQuery,
            state: { status: 'error', error },
          });
        }
      }
    }

    void runSearch();

    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);

  return getVisibleSearchState(trimmedQuery, debouncedQuery, storedState);
}
