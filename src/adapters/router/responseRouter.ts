import { useEffect, useState, useCallback } from 'react'
import useFetch from '@/adapters/api/useFetch'
import { IVacancy } from '@/types/entities/vacancy.types'
import {
  IResponseListResult,
  IResponseResult,
} from '@/types/entities/api.types'

export function useGetResponses() {
  const [vacancies, setVacancies] = useState<IVacancy[]>([])
  const { data, loading, error, refetch } = useFetch<IResponseListResult>(
    '/api/responses',
    {},
    true
  )

  const fetchResponses = useCallback(async () => {
    const result = await refetch()
    return result
  }, [refetch])

  useEffect(() => {
    if (data?.data) {
      const mappedVacancies = data.data.map(response => ({
        ...response.vacancy,
        favoriteId: response.id,
      }))
      setVacancies(mappedVacancies)
    }
  }, [data])

  useEffect(() => {
    fetchResponses()
  }, [fetchResponses])

  return {
    vacancies,
    loading,
    error,
    refetch: fetchResponses,
  }
}

export function useAddResponse() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refetch } = useFetch<IResponseResult>()

  const addResponse = useCallback(
    async (
      vacancyId: number
    ): Promise<IResponseResult | { message: string }> => {
      setLoading(true)
      setError(null)

      try {
        const result = await refetch({
          url: '/api/responses',
          method: 'POST',
          body: JSON.stringify({ vacancyId }),
        })

        return result
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        setError(errorMessage)
        return { message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [refetch]
  )

  return { addResponse, loading, error }
}

export function useDeleteResponse() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refetch } = useFetch()

  const deleteResponse = useCallback(
    async (vacancyId: number): Promise<{ message: string }> => {
      setLoading(true)
      setError(null)

      try {
        await refetch({
          url: `/api/responses/${vacancyId}`,
          method: 'DELETE',
        })

        return { message: 'Удалено из избранного' }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        setError(errorMessage)
        return { message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [refetch]
  )

  return { deleteResponse, loading, error }
}

export function useCheckFavorite(vacancyId: number | undefined) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { refetch } = useFetch<{ isFavorite: boolean }>()

  const checkFavorite = useCallback(async (): Promise<{
    isFavorite: boolean
  }> => {
    if (!vacancyId) {
      setIsFavorite(false)
      setLoading(false)
      return { isFavorite: false }
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsFavorite(false)
        setLoading(false)
        return { isFavorite: false }
      }

      const result = await refetch({
        url: `/api/responses/check/${vacancyId}`,
        method: 'GET',
      })

      const isFav = result?.isFavorite || false
      setIsFavorite(isFav)
      return { isFavorite: isFav }
    } catch (error) {
      throw new Error(`Error checking favorite:, ${error}`)
      setIsFavorite(false)
      return { isFavorite: false }
    } finally {
      setLoading(false)
    }
  }, [vacancyId, refetch])

  useEffect(() => {
    checkFavorite()
  }, [checkFavorite])

  return { isFavorite, loading, refetch: checkFavorite }
}
