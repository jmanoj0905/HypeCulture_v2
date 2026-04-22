import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

class APIClientFacade {
  private client: AxiosInstance
  private retries = 3

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    })
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig | undefined
        if (!config) return Promise.reject(error)

        const isNetworkError = !error.response
        const isGet = (config.method ?? '').toUpperCase() === 'GET'

        if (isNetworkError && isGet && this.retries > 0) {
          this.retries--
          await new Promise((r) => setTimeout(r, 1000))
          return this.client(config)
        }

        return Promise.reject(error)
      }
    )
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }
}

const apiFacade = new APIClientFacade()

export default apiFacade
export { apiFacade, APIClientFacade }
