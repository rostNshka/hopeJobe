import { IPagination } from '@/types/entities/api.types'
import useFetch from '@/adapters/api/useFetch'
import { useCallback } from 'react'
import { IVacancy, IVacancyCreateData } from '@/types/entities/vacancy.types'
import { ICheckResult, IVacancyResult } from '@/types/entities/api.types'
import { useState, useEffect, useRef } from 'react'
import { userStore } from '@/stores/user-store'

export function useVacancy(searchQuery?: string, page: number = 1) {
  const [vacancies, setVacancies] = useState<IVacancy[]>([])
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const prevSearchQuery = useRef<string | undefined>(searchQuery)
  const prevPage = useRef<number>(page)

  const buildUrl = useCallback((pageNum: number, search?: string) => {
    let url = `/api/vacancies/?page=${pageNum}&limit=9`
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`
    }
    return url
  }, [])

  const {
    data,
    loading,
    error: fetchError,
    refetch,
  } = useFetch<IVacancyResult>(buildUrl(page, searchQuery), {
    method: 'GET',
  })

  useEffect(() => {
    if (data) {
      setVacancies(data.data)
      setPagination(data.pagination)
      setIsLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (fetchError) {
      setError(fetchError)
      setIsLoading(false)
    }
  }, [fetchError])

  useEffect(() => {
    if (searchQuery !== prevSearchQuery.current || page !== prevPage.current) {
      prevSearchQuery.current = searchQuery
      prevPage.current = page
      setIsLoading(true)
      setError(null)
      refetch({
        url: buildUrl(page, searchQuery),
      })
    }
  }, [searchQuery, page, refetch, buildUrl])

  return {
    vacancies,
    pagination,
    loading: isLoading || loading,
    error,
    refetch: () => refetch({ url: buildUrl(page, searchQuery) }),
  }
}

export function useVacancyId(id: string) {
  const { data, loading, error, refetch } = useFetch<IVacancyResult>(
    `/api/vacancies/${id}`,
    {
      method: 'GET',
    }
  )

  return {
    vacancies: data?.data?.[0] || data?.data || null,
    loading,
    error,
    refetch,
  }
}

export function useMyVacancy() {
  const { data, loading, error, refetch } = useFetch<IVacancyResult>(
    '/api/vacancies/employer/my-vacancies',
    {
      method: 'GET',
    }
  )

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useAddVacancy() {
  const { loading, error, data, refetch } = useFetch<IVacancyResult>(
    '/api/vacancies',
    { method: 'POST' }
  )

  const user = userStore.user
  if (!user) {
    return { message: 'Пожалуйста, авторизуйтесь' }
  }

  if (user.role !== 'EMPLOYER' && user.role !== 'USER') {
    return { message: 'Только работодатели могут создавать вакансии' }
  }

  const addVacancy = async (formData: IVacancyCreateData) => {
    try {
      const result = await refetch({
        body: JSON.stringify(formData),
      })
      return { data: result }
    } catch (error) {
      return { message: (error as Error).message || String(error) }
    }
  }

  return {
    addVacancy,
    loading,
    error,
    data: data || null,
  }
}

export function useUpdateVacancy() {
  const { loading, error, refetch } = useFetch<IVacancy>(
    undefined,
    { method: 'PUT' },
    true
  )

  const updateVacancy = (id: number, updatedData: IVacancyCreateData) => {
    return refetch({
      url: `/api/vacancies/${id}`,
      body: JSON.stringify(updatedData),
    })
  }

  return {
    updateVacancy,
    loading,
    error,
  }
}

export function useDeleteVacancy() {
  const { loading, error, refetch } = useFetch<IVacancyResult>(
    undefined,
    { method: 'DELETE' },
    true
  )

  const deleteVacancy = (id: number) => {
    return refetch({
      url: `/api/vacancies/${id}`,
    })
  }

  return {
    deleteVacancy,
    loading,
    error,
  }
}

export function useCheckFavorite(vacancyId: number) {
  const { data, loading, error, refetch } = useFetch<ICheckResult>(
    `/api/responses/check/${vacancyId}`,
    { method: 'GET' },
    true
  )

  const checkFavorite = useCallback(async () => {
    try {
      const result = await refetch()
      return { isFavorite: result?.data?.isFavorite || false }
    } catch (error) {
      return {
        isFavorite: false,
        message: (error as Error).message || String(error),
        error,
      }
    }
  }, [refetch])

  return {
    isFavorite: data?.data?.isFavorite || false,
    loading,
    error,
    checkFavorite,
    refetch,
  }
}
