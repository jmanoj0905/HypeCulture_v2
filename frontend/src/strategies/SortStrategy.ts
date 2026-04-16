import type { Product } from '@api/products'

export interface SortStrategy {
  readonly id: string
  readonly label: string
  sort(products: Product[]): Product[]
}

export const SORT_STRATEGIES: SortStrategy[] = []

export function registerStrategy(strategy: SortStrategy): void {
  SORT_STRATEGIES.push(strategy)
}

export function getStrategy(id: string): SortStrategy | undefined {
  return SORT_STRATEGIES.find((s) => s.id === id)
}

export function getStrategyIds(): string[] {
  return SORT_STRATEGIES.map((s) => s.id)
}