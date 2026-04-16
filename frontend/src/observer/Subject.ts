/**
 * Observer Pattern Implementation
 *
 * Provides publish-subscribe mechanism for:
 * - Auth state changes
 * - Cart updates
 * - Pending actions (login then execute)
 *
 * GRASP: Low Coupling - components don't poll, they subscribe
 * GRASP: Indirection - observer mediates between subjects and dependents
 */

export type ObserverCallback<T> = (data: T) => void

export interface Subscription {
  unsubscribe(): void
}

export interface PendingAction {
  type: string
  payload?: unknown
  execute: () => Promise<void> | void
}

export class Subject<T> {
  private observers: Map<string, ObserverCallback<T>> = new Map()
  private pendingActions: PendingAction[] = []
  private lastAuthState: { userId: number | null; role: string | null } | null = null

  subscribe(id: string, callback: ObserverCallback<T>): Subscription {
    this.observers.set(id, callback)
    return {
      unsubscribe: () => this.observers.delete(id),
    }
  }

  unsubscribe(id: string): void {
    this.observers.delete(id)
  }

  notify(data: T): void {
    this.observers.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error('Observer error:', error)
      }
    })
  }

  get observerCount(): number {
    return this.observers.size
  }

  storePendingAction(action: PendingAction): void {
    this.pendingActions.push(action)
  }

  clearPendingActions(): void {
    this.pendingActions = []
  }

  getPendingActions(): PendingAction[] {
    return this.pendingActions
  }

  async executePendingActions(userId: number | null): Promise<void> {
    if (userId === null || userId === undefined) return
    const actions = [...this.pendingActions]
    this.pendingActions = []
    for (const action of actions) {
      try {
        await action.execute()
      } catch (error) {
        console.error('Pending action error:', error)
      }
    }
  }

  setLastAuthState(state: { userId: number | null; role: string | null } | null): void {
    this.lastAuthState = state
  }

  getLastAuthState(): { userId: number | null; role: string | null } | null {
    return this.lastAuthState
  }
}

export class AuthSubject extends Subject<{ userId: number | null; role: string | null }> {}
export class CartSubject extends Subject<{ itemCount: number; subtotal: number }> {}

export const authSubject = new AuthSubject()
export const cartSubject = new CartSubject()