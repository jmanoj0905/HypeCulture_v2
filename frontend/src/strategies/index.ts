import type { Product } from '@api/products'
import type { SortStrategy } from './SortStrategy'
import { PriceAscending } from './PriceAscending'
import { PriceDescending } from './PriceDescending'
import { NewestFirst } from './NewestFirst'

const strategies: SortStrategy[] = [new PriceAscending(), new PriceDescending(), new NewestFirst()]

export { type SortStrategy } from './SortStrategy'
export { PriceAscending } from './PriceAscending'
export { PriceDescending } from './PriceDescending'
export { NewestFirst } from './NewestFirst'

export function getSortStrategy(id: string): SortStrategy | undefined {
  return strategies.find((s) => s.id === id)
}

export function getAllSortStrategies(): SortStrategy[] {
  return strategies
}

export function applySortStrategy(
  products: Product[],
  strategyId: string
): Product[] {
  const strategy = getSortStrategy(strategyId)
  return strategy ? strategy.sort(products) : products
}