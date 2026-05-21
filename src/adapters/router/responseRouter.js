import { useEffect, useState } from 'react'

export function useGetResponses() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('/api/responses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const vacancies =
    data?.data?.map((response) => ({
      ...response.vacancy,
      favoriteId: response.id,
      favoritedAt: response.createdAt,
    })) || []

  return {
    vacancies,
    loading,
    error,
    refetch: fetchFavorites,
  }
}

export function useAddResponse() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addResponse = async (vacancyId) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vacancyId }),
      })

      let result
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        result = { message: await response.text() }
      }

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка добавления в избранное')
      }

      return { success: true, data: result.data }
    } catch (error) {
      setError(error.message)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { addResponse, loading, error }
}

export function useDeleteResponse() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteResponse = async (vacancyId) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/responses/${vacancyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      let result
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        result = { message: await response.text() }
      }

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка удаления из избранного')
      }

      return { success: true, message: result.message }
    } catch (error) {
      setError(error.message)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { deleteResponse, loading, error }
}

export function useCheckFavorite(vacancyId) {
  const [isFavorite, setIsFavorite] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkFavorite = async () => {
    if (!vacancyId) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsFavorite(false)
        setLoading(false)
        return
      }

      const response = await fetch(`/api/responses/check/${vacancyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()
      setIsFavorite(result.data?.isFavorite || false)
    } catch (error) {
      console.error('Error checking favorite:', error)
      setIsFavorite(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkFavorite()
  }, [vacancyId])

  return { isFavorite, loading, refetch: checkFavorite }
}
