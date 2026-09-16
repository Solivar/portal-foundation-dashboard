import type { Product } from '../types/product';
import { productMocks } from '../mocks/productMocks';
import { delay } from './delay';

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(350);

  const normalizedQuery = query.toLowerCase();

  return productMocks.filter((product) =>
    [product.name, product.category].some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}
