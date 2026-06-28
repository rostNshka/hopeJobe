import { useCallback, useEffect, useState } from 'react'

function useFetch(url, defaultOptions = {}, skipFetch = false) {
  const [loading, setLoading] = useState(!skipFetch)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const fetchData = useCallback(
    async (customOptions = {}) => {
      setLoading(true)
      setError(null)

      const getToken = () => {
        return localStorage.getItem('token')
      }

      const finalUrl = customOptions.url || url

      if (!finalUrl) {
        throw new Error('URL is required')
      }

      const options = {
        ...defaultOptions,
        ...customOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
          ...defaultOptions.headers,
          ...customOptions.headers,
        },
      }

      delete options.url

      if (customOptions.body && typeof customOptions.body === 'object') {
        options.body = JSON.stringify(customOptions.body)
      } else if (customOptions.body) {
        options.body = customOptions.body
      }

      try {
        const response = await fetch(finalUrl, options)

        let result
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          result = await response.json()
        } else {
          result = { message: await response.text() }
        }

        if (!response.ok) {
          const errorMessage =
            result.message ||
            result.errors?.map((e) => e.msg).join(', ') ||
            `HTTP ${response.status}`
          throw new Error(errorMessage)
        }

        setData(result)
        return result
      } catch (err) {
        setError(err.message)
        setData(null)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url, JSON.stringify(defaultOptions)],
  )

  useEffect(() => {
    if (!skipFetch && url) {
      fetchData()
    }
  }, [fetchData, skipFetch, url])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
