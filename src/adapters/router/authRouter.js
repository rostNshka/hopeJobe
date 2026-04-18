import useFetch from '@/adapters/api/useFetch'

export function useRegister() {
  const { data, loading, error, refetch } = useFetch('/api/auth/register', {
    method: 'POST',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}

export function useLogin() {
  const { data, loading, error, refetch } = useFetch('/api/auth/login', {
    method: 'POST',
  })

  return {
    vacancies: data?.data || [],
    loading,
    error,
    refetch,
  }
}
