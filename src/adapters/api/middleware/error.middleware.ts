import { Middleware, QueueItem } from '@/types/entities/api.client.types'
import { userStore } from '@/stores/user-store'
import { sessionService } from '../sessionService'

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  for (const item of failedQueue) {
    if (error) {
      item.reject(error)
    } else if (token) {
      item.resolve(token)
    }
  }
  failedQueue = []
}

export const errorMiddleware: Middleware = request => {
  return {
    ...request,
  }
}

export const handleError = async <T>(
  requestFn: () => Promise<T>,
  skipAuth: boolean = false,
  navigate?: (path: string) => void
): Promise<T> => {
  try {
    return await requestFn()
  } catch (error) {
    const apiError = error as Error & { status?: number }

    if (apiError.status === 401 && !skipAuth) {
      if (!userStore.user) {
        throw error
      }

      if (!isRefreshing) {
        isRefreshing = true

        try {
          await sessionService.refreshSession()

          const newToken = userStore.accessToken
          if (!newToken) {
            throw new Error('No access token after refresh')
          }

          processQueue(null, newToken)
          isRefreshing = false
          return await requestFn()
        } catch (refreshError) {
          processQueue(refreshError as Error, null)
          isRefreshing = false
          userStore.logout()
          if (navigate) {
            navigate('/')
          }
          throw refreshError
        }
      }

      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: async (token: string) => {
            try {
              resolve(await requestFn())
            } catch (err) {
              reject(err as Error)
            }
          },
          reject: (reason?: Error) => {
            reject(reason || new Error('Request failed'))
          },
        })
      })
    }

    throw error
  }
}
