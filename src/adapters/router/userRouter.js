import useFetch from '@/adapters/api/useFetch'

export function useProfile() {
  const { data, loading, error, refetch } = useFetch('/api/users/profile', {
    method: 'GET',
  })

  return {
    profile: data?.data || [],
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
    profile: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useStatistics() {
  const { data, loading, error, refetch } = useFetch('/api/users/stats', {
    method: 'GET',
  })

  return {
    stats: data?.data || [],
    loading,
    error,
    refetch,
  }
}
