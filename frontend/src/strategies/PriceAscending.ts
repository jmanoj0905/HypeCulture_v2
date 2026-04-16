import type { Product } from '@api/products'
import type { SortStrategy } from './SortStrategy'

export class PriceAscending implements SortStrategy {
  readonly id = 'price_asc'
  readonly label = 'Price: Low → High'

  sort(products: Product[]): Product[] {
    return [...products].sort(
      (a, b) => (a.lowestPrice ?? 0) - (b.lowestPrice ?? 0)
    )
  }
}