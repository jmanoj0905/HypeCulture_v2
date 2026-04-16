import type { Product } from '@api/products'
import type { SortStrategy } from './SortStrategy'

export class PriceDescending implements SortStrategy {
  readonly id = 'price_desc'
  readonly label = 'Price: High → Low'

  sort(products: Product[]): Product[] {
    return [...products].sort(
      (a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0)
    )
  }
}