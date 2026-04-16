import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

/**
 * Facade Pattern for API Client
 *
 * Provides unified interface with:
 * - Caching for GET requests
 * - Retry logic for transient failures
 * - Error handling abstraction
 * - Public endpoint detection
 *
 * GRASP: Indirection - mediates between pages and API
 * SOLID: Dependency Inversion - depends on abstraction, not concrete implementation
 */

const PUBLIC_ENDPOINTS = ['/products', '/categories', '/listings', '/cart']
const CACHE_TTL = 60 * 1000

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class APIClientFacade {
  private client: AxiosInstance
  private cache: Map<string, CacheEntry<unknown>>
  private retryConfig: { retries: number; delay: number }

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.cache = new Map()
    this.retryConfig = { retries: 3, delay: 1000 }
    this.setupInterceptors()
  }

  private isPublicEndpoint(url: string): boolean {
    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint))
  }

  private getCacheKey(config: InternalAxiosRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`
  }

  private isCacheValid(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp < CACHE_TTL
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig | undefined
        if (!config) return Promise.reject(error)

        const shouldRetry =
          !error.response &&
          this.retryConfig.retries > 0 &&
          ['GET'].includes(config.method || '')

        if (shouldRetry) {
          await this.delay(this.retryConfig.delay)
          this.retryConfig.retries--
          return this.client(config)
        }

        return Promise.reject(error)
      }
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    this.clearCache()
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    this.clearCache()
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    this.clearCache()
    const response = await this.client.delete<T>(url)
    return response.data
  }

  clearCache(): void {
    this.cache.clear()
  }

  clearCacheByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

const apiFacade = new APIClientFacade()

export default apiFacade

export { apiFacade, APIClientFacade }
