import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from './apiClient.instance'
import { handleError } from './middleware/error.middleware'
import {
  IFetchOptions,
  IUseFetchReturn,
  IRequestOptions,
} from '@/types/entities/api.client.types'

function useFetch<T>(
  url?: string,
  defaultOptions: IFetchOptions = {},
  skipFetch: boolean = false
): IUseFetchReturn<T> {
  const [loading, setLoading] = useState<boolean>(!skipFetch)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const defaultOptionsRef = useRef(defaultOptions)

  const navigate = useNavigate()

  const fetchData = useCallback(
    async (customOptions: IFetchOptions = {}): Promise<T> => {
      setLoading(true)
      setError(null)

      const finalUrl = customOptions.url || url || ''
      if (!finalUrl) {
        throw new Error('URL is required')
      }

      const { skipAuth = false, ...restOptions } = customOptions

      try {
        const requestOptions: IRequestOptions = {
          ...defaultOptionsRef.current,
          ...restOptions,
          skipAuth,
        }

        const requestFn = () => apiClient.request<T>(finalUrl, requestOptions)

        const result = await handleError(requestFn, skipAuth, navigate)
        setData(result)
        setError(null)
        return result
      } catch (err) {
        const error = err as Error & { status?: number }
        if (error.status === 401) {
          setError('Сессия истекла. Войдите заново')
          setData(null)
        } else {
          setError(error.message || 'Произошла ошибка')
          setData(null)
        }
        throw error
      } finally {
        setLoading(false)
      }
    },
    [url, navigate]
  )

  useEffect(() => {
    if (!skipFetch && url) {
      fetchData()
    }
  }, [fetchData, skipFetch, url])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
