import useFetch from '@/adapters/api/useFetch'

export function useProfile() {
  const { data, loading, error, refetch } = useFetch('/api/users/profile', {
    method: 'GET',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useProfileUpdate() {
  const { data, loading, error, refetch } = useFetch('/api/users/profile', {
    method: 'PUT',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}
