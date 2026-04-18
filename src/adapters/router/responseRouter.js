import useFetch from '@/adapters/api/useFetch'

export function useGetResponses() {
  const { data, loading, error, refetch } = useFetch('/api/responses', {
    method: 'GET',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useAddResponses() {
  const { data, loading, error, refetch } = useFetch('/api/responses', {
    method: 'POST',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useDeleteResponses() {
  const { data, loading, error, refetch } = useFetch('/api/responses', {
    method: 'DELETE',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}
