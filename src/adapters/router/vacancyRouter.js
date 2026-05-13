import useFetch from '@/adapters/api/useFetch'

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

export function useUpdateVacancy(id) {
  const { data, loading, error, refetch } = useFetch(`/api/vacancies/${id}`, {
    method: 'PUT',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useDeleteVacancy(id) {
  const { data, loading, error, refetch } = useFetch(`/api/vacancies/${id}`, {
    method: 'DELETE',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}
