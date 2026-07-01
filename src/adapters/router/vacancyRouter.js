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
      return { data: result }
    } catch (error) {
      return { message: error.message }
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
  const { loading, error, refetch } = useFetch(null, { method: 'PUT' }, true)

  const updateVacancy = (id, updatedData) => {
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
  const { loading, error, refetch } = useFetch(null, { method: 'DELETE' }, true)

  const deleteVacancy = (id) => {
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
