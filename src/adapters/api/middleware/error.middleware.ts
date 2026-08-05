import { Middleware } from '@/types/entities/api.client.types'
import { userStore } from '@/stores/user-store'
import { QueueItem } from '@/types/entities/api.client.types'
import { apiClient } from '../apiClient.instance'

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

  const response = await apiClient.request<{
    accessToken: string
    refreshToken: string
  }>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken: userStore.refreshToken },
    skipAuth: true,
  })

  userStore.setTokens(response.accessToken, response.refreshToken)
  return response.accessToken
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
