import { useEffect, useState } from 'react'
import useFetch from '@/adapters/api/useFetch'

export function useGetResponses() {
  const [vacancies, setVacancies] = useState([])
  const { data, loading, error, refetch } = useFetch('/api/responses', {}, true)

  useEffect(() => {
    if (data?.data) {
      const mappedVacancies = data.data.map((response) => ({
        ...response.vacancy,
        favoriteId: response.id,
        favoritedAt: response.createdAt,
      }))
      setVacancies(mappedVacancies)
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [])

  return {
    vacancies,
    loading,
    error,
    refetch,
  }
}

export function useAddResponse() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { refetch } = useFetch()

  const addResponse = async (vacancyId) => {
    setLoading(true)
    setError(null)

    try {
      const result = await refetch({
        url: '/api/responses',
        method: 'POST',
        body: { vacancyId },
      })

      return { data: result.data }
    } catch (error) {
      setError(error.message)
      return { message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { addResponse, loading, error }
}

export function useDeleteResponse() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { refetch } = useFetch()

  const deleteResponse = async (vacancyId) => {
    setLoading(true)
    setError(null)

    try {
      await refetch({
        url: `/api/responses/${vacancyId}`,
        method: 'DELETE',
      })

      return { message: 'Удалено из избранного' }
    } catch (error) {
      setError(error.message)
      return { message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { deleteResponse, loading, error }
}

export function useCheckFavorite(vacancyId) {
  const [isFavorite, setIsFavorite] = useState(null)
  const [loading, setLoading] = useState(true)
  const { refetch } = useFetch()

  const checkFavorite = async () => {
    if (!vacancyId) {
      setIsFavorite(false)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsFavorite(false)
        setLoading(false)
        return
      }

      const result = await refetch({
        url: `/api/responses/check/${vacancyId}`,
        method: 'GET',
      })

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
