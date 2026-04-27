// adapters/router/authRouter.js
import useFetch from '@/adapters/api/useFetch'
import { useCallback } from 'react'

export function useRegister() {
  const { data, loading, error, refetch } = useFetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const register = useCallback(
    async (userData) => {
      const result = await refetch({
        body: JSON.stringify(userData),
      })
      return result
    },
    [refetch],
  )

  return {
    data: data?.data || null,
    loading,
    error,
    register,
  }
}

export function useLogin() {
  const { data, loading, error, refetch } = useFetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const login = useCallback(
    async (credentials) => {
      const result = await refetch({
        body: JSON.stringify(credentials),
      })
      return result
    },
    [refetch],
  )

  return {
    data: data?.data || null,
    loading,
    error,
    login,
  }
}
