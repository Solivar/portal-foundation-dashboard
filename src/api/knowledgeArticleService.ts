import type { KnowledgeArticle } from '../types/knowledgeArticle';
import { knowledgeArticleMocks } from '../mocks/knowledgeArticleMocks';
import { delay } from './delay';

export async function searchKnowledgeArticles(query: string): Promise<KnowledgeArticle[]> {
  await delay(450);

  const normalizedQuery = query.toLowerCase();

  return knowledgeArticleMocks.filter((article) =>
    [article.title, article.summary].some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}
