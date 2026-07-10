import useFetch from '@/adapters/api/useFetch'
import { useCallback } from 'react'
import { IUserAssets, IUserData } from '@/types/entities/user.types'
import { ILoginResponse, IRegisterResponse } from '@/types/entities/api.types'

export function useRegister() {
  const { data, loading, error, refetch } = useFetch<IRegisterResponse>(
    '/api/auth/register',
    { method: 'POST' },
    true
  )

  const register = useCallback(
    async (userData: IUserData): Promise<IRegisterResponse> => {
      const result: IRegisterResponse = await refetch({
        body: JSON.stringify(userData),
      })
      return result
    },
    [refetch]
  )

  return {
    user: data,
    loading,
    error,
    execute: register,
  }
}

export function useLogin() {
  const { data, loading, error, refetch } = useFetch<ILoginResponse>(
    '/api/auth/login',
    { method: 'POST' },
    true
  )

  const login = useCallback(
    async (credentials: IUserAssets): Promise<ILoginResponse> => {
      const result: ILoginResponse = await refetch({
        body: JSON.stringify(credentials),
        skipAuth: true,
      })
      return result
    },
    [refetch]
  )

  return {
    user: data?.user,
    token: data?.token,
    loading,
    error,
    execute: login,
  }
}
