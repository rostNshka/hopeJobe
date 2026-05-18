import useFetch from '@/adapters/api/useFetch'
import { useState } from 'react'

export function useVacancy() {
  const { data, loading, error, refetch } = useFetch('/api/vacancies', {
    method: 'GET',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useVacancyId(id) {
  const { data, loading, error, refetch } = useFetch(`/api/vacancies/${id}`, {
    method: 'GET',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useMyVacancy() {
  const { data, loading, error, refetch } = useFetch(
    '/api/vacancies/employer/my-vacancies',
    {
      method: 'GET',
    },
  )

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useAddVacancy() {
  const { loading, error, data, refetch } = useFetch(
    '/api/vacancies',
    { method: 'POST' },
    true,
  )

  const addVacancy = async (formData) => {
    try {
      const result = await refetch({
        body: JSON.stringify(formData),
      })
      return { success: true, data: result }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return {
    addVacancy,
    loading,
    error,
    data: data?.data || null,
  }
}

export function useUpdateVacancy() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateVacancy = async (id, updatedData) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/vacancies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      let result
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        result = { message: await response.text() }
      }

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка обновления')
      }

      return { success: true, data: result }
    } catch (error) {
      setError(error.message)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    updateVacancy,
    loading,
    error,
  }
}

export function useDeleteVacancy() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteVacancy = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/vacancies/${id}`, {
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
        throw new Error(result.message || 'Ошибка удаления')
      }

      return { success: true, data: result }
    } catch (error) {
      setError(error.message)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteVacancy,
    loading,
    error,
  }
}
