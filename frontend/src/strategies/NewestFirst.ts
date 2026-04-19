import type { Product } from '@api/products'
import type { SortStrategy } from './SortStrategy'

export class NewestFirst implements SortStrategy {
  readonly id = 'newest'
  readonly label = 'Newest'

  sort(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.productId - a.productId)
  }
}