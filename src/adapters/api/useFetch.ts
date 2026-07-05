import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'

interface IFetchOptions extends RequestInit {
  url?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

interface IUseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: (customOptions?: IFetchOptions) => Promise<T>
}

function useFetch<T>(
  url: string,
  defaultOptions: IFetchOptions = {},
  skipFetch: boolean = false,
): IUseFetchReturn<T> {
  const [loading, setLoading] = useState<boolean>(!skipFetch)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const defaultOptionsRef = useRef(defaultOptions)

  const navigate = useNavigate()
  const { logout, token } = useUser()

  const handleUnauthorized = useCallback((): void => {
    logout()
    navigate('/')
  }, [logout, navigate])

  const buildUrlWithParams = useCallback(
    (
      baseUrl: string,
      params?: Record<string, string | number | boolean>,
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
    [],
  )

  const fetchData = useCallback(
    async (customOptions: IFetchOptions = {}): Promise<T> => {
      setLoading(true)
      setError(null)

      const { params } = customOptions

      let finalUrl: string = customOptions.url || url

      if (!finalUrl) {
        throw new Error('URL is required')
      }

      if (params) {
        finalUrl = buildUrlWithParams(finalUrl, params)
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...defaultOptions.headers,
        ...customOptions.headers,
      }

      const options = {
        ...defaultOptionsRef.current,
        ...customOptions,
        headers,
      }

      delete options.url

      if (customOptions.body && typeof customOptions.body === 'object') {
        options.body = JSON.stringify(customOptions.body)
      } else if (customOptions.body) {
        options.body = customOptions.body
      }

      try {
        const response = await fetch(finalUrl, options)

        let result: T
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          result = (await response.json()) as T
        } else {
          const text = await response.text()
          result = { message: text } as T
        }

        if (response.status === 401) {
          handleUnauthorized()
          const authError = new Error(
            'Сессия истекла. Войдите заново',
          ) as Error & { status?: number }
          setError(authError.message)
          setData(null)
          return Promise.reject(authError)
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
    [url, handleUnauthorized, token, buildUrlWithParams],
  )

  useEffect(() => {
    if (!skipFetch && url) {
      fetchData()
    }
  }, [fetchData, skipFetch, url])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
