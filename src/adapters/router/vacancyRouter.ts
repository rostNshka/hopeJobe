import useFetch from '@/adapters/api/useFetch'
import { useCallback } from 'react'
import { IVacancy, IVacancyCreateData } from '@/types/entities/vacancy.types'
import { ICheckResult, IVacancyResult } from '@/types/entities/api.types'

export function useVacancy() {
  const { data, loading, error, refetch } = useFetch<IVacancyResult>(
    '/api/vacancies',
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

export function useVacancyId(id: string) {
  const { data, loading, error, refetch } = useFetch<IVacancyResult>(
    `/api/vacancies/${id}`,
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
    { method: 'POST' },
    true
  )

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
