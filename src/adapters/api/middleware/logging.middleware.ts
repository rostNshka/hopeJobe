import { Middleware } from '@/types/entities/api.client.types'

export const loggingMiddleware: Middleware = request => {
  if (import.meta.env.DEV || process.env.NODE_ENV === 'development') {
    const method = request.method || 'GET'
    console.log(`[API] ${method} ${request.url}`)
  }
  return request
}
