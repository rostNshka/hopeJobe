import { userStore } from '@/stores/user-store'
import {
  ApiError,
  isApiError,
  QueueItem,
} from '@/types/entities/api.client.types'

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

const refreshAccessToken = async (): Promise<string> => {
  if (!userStore.refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: userStore.refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Refresh failed')
  }

  const data: { accessToken: string; refreshToken: string } =
    await response.json()
  userStore.setTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

export const createErrorInterceptor = (navigate: (path: string) => void) => {
  return async <T>(
    requestFn: () => Promise<T>,
    skipAuth: boolean = false
  ): Promise<T> => {
    try {
      return await requestFn()
    } catch (error) {
      if (!isApiError(error as Error)) {
        throw error
      }

      const apiError = error as ApiError

      if (apiError.status === 401 && !skipAuth) {
        if (!isRefreshing) {
          isRefreshing = true

          try {
            const newToken = await refreshAccessToken()
            processQueue(null, newToken)
            isRefreshing = false
            return await requestFn()
          } catch (refreshError) {
            processQueue(refreshError as Error, null)
            isRefreshing = false
            userStore.logout()
            navigate('/')
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
}
