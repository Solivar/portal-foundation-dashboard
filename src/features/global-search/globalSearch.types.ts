import type { KnowledgeArticle } from '../../types/knowledgeArticle';
import type { Product } from '../../types/product';
import type { ServiceTicket } from '../../types/supportTicket';

export type GlobalSearchResults = {
  products: Product[];
  knowledgeArticles: KnowledgeArticle[];
  supportTickets: ServiceTicket[];
};
