import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userStore } from '@/stores/user-store'

interface IFetchOptions extends RequestInit {
  url?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  skipAuth?: boolean
}

interface IUseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: (customOptions?: IFetchOptions) => Promise<T>
}

type QueueItem = {
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}

function useFetch<T>(
  url?: string,
  defaultOptions: IFetchOptions = {},
  skipFetch: boolean = false
): IUseFetchReturn<T> {
  const [loading, setLoading] = useState<boolean>(!skipFetch)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const defaultOptionsRef = useRef(defaultOptions)
  const isRefreshing = useRef(false)

  const failedQueue = useRef<Array<QueueItem>>([])

  const navigate = useNavigate()

  const processQueue = useCallback(
    (error: Error | null, token: string | null = null) => {
      failedQueue.current.forEach(item => {
        if (error) {
          item.reject(error)
        } else if (token) {
          item.resolve(token)
        }
      })
      failedQueue.current = []
    },
    []
  )

  const handleUnauthorized = useCallback((): void => {
    userStore.logout()
    navigate('/')
  }, [navigate])

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    if (!userStore.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
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

      const data = await response.json()
      userStore.setTokens(data.accessToken, data.refreshToken)
      return data.accessToken
    } catch (error) {
      handleUnauthorized()
      throw error
    }
  }, [handleUnauthorized])

  const buildUrlWithParams = useCallback(
    (
      baseUrl: string,
      params?: Record<string, string | number | boolean>
    ): string => {
      if (!params) {
        return baseUrl
      }

      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })

      const queryString: string = searchParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    []
  )

  const fetchData = useCallback(
    async (customOptions: IFetchOptions = {}): Promise<T> => {
      setLoading(true)
      setError(null)

      const { params, skipAuth = false } = customOptions

      let finalUrl: string = customOptions.url || url || ''
      if (!finalUrl) {
        throw new Error('URL is required')
      }

      if (params) {
        finalUrl = buildUrlWithParams(finalUrl, params)
      }

      let currentToken = userStore.accessToken

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(currentToken && !skipAuth
          ? { Authorization: `Bearer ${currentToken}` }
          : {}),
        ...defaultOptions.headers,
        ...customOptions.headers,
      }

      const options = {
        ...defaultOptionsRef.current,
        ...customOptions,
        headers,
      }

      delete options.url
      delete options.skipAuth

      if (customOptions.body && typeof customOptions.body === 'object') {
        options.body = JSON.stringify(customOptions.body)
      } else if (customOptions.body) {
        options.body = customOptions.body
      }

      try {
        let response = await fetch(finalUrl, options)

        if (response.status === 401 && !skipAuth) {
          if (!isRefreshing.current) {
            isRefreshing.current = true

            try {
              const newToken = await refreshAccessToken()
              currentToken = newToken

              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              }

              processQueue(null, newToken)
              response = await fetch(finalUrl, options)
            } catch (refreshError) {
              processQueue(refreshError as Error, null)
              throw refreshError
            } finally {
              isRefreshing.current = false
            }
          } else {
            try {
              const newToken = await new Promise<string>((resolve, reject) => {
                failedQueue.current.push({ resolve, reject })
              })

              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              }
              response = await fetch(finalUrl, options)
            } catch (queueError) {
              throw queueError
            }
          }
        }

        let result: T
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          result = (await response.json()) as T
        } else {
          const text = await response.text()
          result = { message: text } as T
        }

        if (response.status === 401) {
          if (skipAuth) {
            const error = new Error('Неверные данные') as Error & {
              status: number
            }
            error.status = 401
            setError(error.message)
            setData(null)
            setLoading(false)
            throw error
          } else {
            handleUnauthorized()
            const authError = new Error(
              'Сессия истекла. Войдите заново'
            ) as Error & { status?: number }
            setError(authError.message)
            setData(null)
            setLoading(false)
            throw authError
          }
        }

        if (!response.ok) {
          const errorObj = result as {
            message?: string
            errors?: Array<{ msg: string }>
          }
          const errorMessage =
            errorObj.message ||
            errorObj.errors?.map((e: { msg: string }) => e.msg).join(', ') ||
            `HTTP ${response.status}`
          throw new Error(errorMessage)
        }

        setData(result)
        return result
      } catch (err) {
        const error = err as Error & { status?: number }
        if (error.status !== 401) {
          setError(error.message)
          setData(null)
        }
        throw error
      } finally {
        setLoading(false)
      }
    },
    [
      url,
      handleUnauthorized,
      buildUrlWithParams,
      refreshAccessToken,
      processQueue,
    ]
  )

  useEffect(() => {
    if (!skipFetch && url) {
      fetchData()
    }
  }, [fetchData, skipFetch, url])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
