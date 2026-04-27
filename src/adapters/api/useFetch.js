import { useCallback, useEffect, useState } from 'react'

function useFetch(url, defaultOptions = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(
    async (customOptions = {}) => {
      setLoading(true)
      setError(null)

      const options = {
        ...defaultOptions,
        ...customOptions,
        headers: {
          'Content-Type': 'application/json',
          ...defaultOptions.headers,
          ...customOptions.headers,
        },
      }

      try {
        const response = await fetch(url, options)

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
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
