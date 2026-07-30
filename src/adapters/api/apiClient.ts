import {
  IApiClientOptions,
  IRequestOptions,
  Middleware,
  RequestBody,
} from '@/types/entities/api.client.types'

export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private middleware: Middleware[]

  constructor(options: IApiClientOptions = {}) {
    this.baseURL = options.baseURL || ''
    this.defaultHeaders = options.defaultHeaders || {
      'Content-Type': 'application/json',
    }
    this.middleware = []
  }

  use(middleware: Middleware): this {
    this.middleware.push(middleware)
    return this
  }

  private buildUrlWithParams(
    url: string,
    params?: Record<string, string | number | boolean>
  ): string {
    if (!params) return url

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  private async processRequest<T>(
    url: string,
    options: IRequestOptions = {}
  ): Promise<T> {
    const { params, ...restOptions } = options

    let fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    if (params) {
      fullUrl = this.buildUrlWithParams(fullUrl, params)
    }

    let request: IRequestOptions = {
      url: fullUrl,
      ...restOptions,
      headers: {
        ...this.defaultHeaders,
        ...restOptions.headers,
      },
    }

    request = this.middleware.reduce<IRequestOptions>(
      (req, middleware) => middleware(req),
      request
    )

    if (
      request.body &&
      typeof request.body === 'object' &&
      !(request.body instanceof FormData)
    ) {
      request.body = JSON.stringify(request.body)
    }

    const { url: _, skipAuth, ...fetchOptions } = request

    const response = await fetch(fullUrl, fetchOptions as RequestInit)

    let result: T
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      result = (await response.json()) as T
    } else {
      const text = await response.text()
      result = { message: text } as T
    }

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`) as Error & {
        status: number
        data?: T
      }
      error.status = response.status
      error.data = result
      throw error
    }

    return result
  }

  async request<T>(url: string, options: IRequestOptions = {}): Promise<T> {
    return this.processRequest<T>(url, options)
  }

  async get<T>(url: string, options: IRequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  async post<T>(
    url: string,
    data?: RequestBody,
    options: IRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data,
    })
  }

  async put<T>(
    url: string,
    data?: RequestBody,
    options: IRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data,
    })
  }

  async delete<T>(url: string, options: IRequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  async patch<T>(
    url: string,
    data?: RequestBody,
    options: IRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data,
    })
  }
}
