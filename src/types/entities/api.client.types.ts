export type RequestBody =
  | BodyInit
  | Record<string, unknown>
  | Array<unknown>
  | null

export interface IFetchOptions extends RequestInit {
  url?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  skipAuth?: boolean
}

export interface IUseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: (customOptions?: IFetchOptions) => Promise<T>
}

export interface IApiClientOptions {
  baseURL?: string
  defaultHeaders?: Record<string, string>
}

export interface IRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  url?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  skipAuth?: boolean
  body?: RequestBody
}

export type Middleware = (request: IRequestOptions) => IRequestOptions

export interface ApiError extends Error {
  status: number
}

export function isApiError(error: Error): error is ApiError {
  return 'status' in error && typeof (error as ApiError).status === 'number'
}

export interface QueueItem {
  resolve: (value: string) => void
  reject: (reason?: Error) => void
}
