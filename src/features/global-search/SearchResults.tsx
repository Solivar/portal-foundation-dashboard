import type { GlobalSearchResults } from './globalSearch.types';
import { SearchResultGroup } from './SearchResultGroup';
import styles from './GlobalSearch.module.scss';

export function SearchResults({ results }: { results: GlobalSearchResults }) {
  const hasResults =
    results.products.length > 0 ||
    results.knowledgeArticles.length > 0 ||
    results.supportTickets.length > 0;

  if (!hasResults) {
    return <p className={styles.statusMessage}>No results found.</p>;
  }

  return (
    <div className={styles.resultGroups}>
      <SearchResultGroup
        heading="Products"
        headingId="global-search-products"
        items={results.products}
        getKey={(product) => product.id}
        getTitle={(product) => product.name}
        getDescription={(product) => product.category}
      />
      <SearchResultGroup
        heading="Knowledge Articles"
        headingId="global-search-articles"
        items={results.knowledgeArticles}
        getKey={(article) => article.id}
        getTitle={(article) => article.title}
        getDescription={(article) => article.summary}
      />
      <SearchResultGroup
        heading="Support Tickets"
        headingId="global-search-tickets"
        items={results.supportTickets}
        getKey={(ticket) => ticket.id}
        getTitle={(ticket) => ticket.id}
        getDescription={(ticket) => `${ticket.status} · ${ticket.priority} priority`}
      />
    </div>
  );
}
