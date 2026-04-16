import { useCallback, useEffect, useState } from 'react'

function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(
    async (url) => {
      setLoading(true)

      try {
        const response = await fetch(url, options)
        const result = await response.json()

        setData(result)
        setError(null)
        return result
      } catch (error) {
        setError(error.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [url, options],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
