import useFetch from '@/adapters/api/useFetch'
import { useCallback } from 'react'
import {
  IUserAssets,
  IUserContextData,
  IUserData,
} from '@/types/entities/user.types'
import { ILoginResponse, IRegisterResponse } from '@/types/entities/api.types'
import { userStore } from '@/stores/user-store'

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
        skipAuth: true,
      })

      if (result.accessToken && result.refreshToken) {
        userStore.setTokens(result.accessToken, result.refreshToken)
        userStore.setUser(result.data as IUserContextData)
      }

      return result
    },
    [refetch]
  )

  return {
    user: data?.data,
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
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

      if (result.accessToken && result.refreshToken) {
        userStore.setTokens(result.accessToken, result.refreshToken)
        userStore.setUser(result.user)
      }

      return result
    },
    [refetch]
  )

  return {
    user: data?.user,
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
    loading,
    error,
    execute: login,
  }
}
