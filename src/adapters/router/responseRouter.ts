import { useEffect, useState, useCallback } from 'react'
import useFetch from '@/adapters/api/useFetch'
import { EWorkType } from '@/components/WorkType/WorkType.tsx'

export interface IBaseVacancy {
  createdAt: string
  description?: string
  employer: {
    companyName: string
    email: string
  }
  employerId: number
  favoriteId: number
  id: number
  location: string
  salary: string
  title: string
  updatedAt?: string
  workType: EWorkType
}

export interface IVacancy extends IBaseVacancy {
  favoriteId: number
}

export interface IAddResponseData {
  id: number
  vacancyId: number
  userId: number
  createdAt: string
}

export interface IAddResponseResult {
  data?: IAddResponseData
  message?: string
}

interface IResponseItem {
  id: number
  vacancy: IVacancy
}

interface IResponseData {
  data: IResponseItem[]
  total?: number
  message?: string
}

interface IAddResponseBody {
  vacancyId: number
}

export function useGetResponses() {
  const [vacancies, setVacancies] = useState<IVacancy[]>([])
  const { data, loading, error, refetch } = useFetch<IResponseData>(
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
  const { refetch } = useFetch<IAddResponseData>()

  const addResponse = useCallback(
    async (vacancyId: number): Promise<IAddResponseResult> => {
      setLoading(true)
      setError(null)

      try {
        const result = await refetch({
          url: '/api/responses',
          method: 'POST',
          body: JSON.stringify({ vacancyId } as IAddResponseBody),
        })

        return { data: result }
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

export function useCheckFavorite(vacancyId: number) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { refetch } = useFetch<{ isFavorite: boolean }>()

  const checkFavorite = useCallback(async () => {
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

      setIsFavorite(result?.isFavorite || false)
    } catch (error) {
      console.error('Error checking favorite:', error)
      setIsFavorite(false)
    } finally {
      setLoading(false)
    }
  }, [vacancyId, refetch])

  useEffect(() => {
    checkFavorite()
  }, [checkFavorite])

  return { isFavorite, loading, refetch: checkFavorite }
}
