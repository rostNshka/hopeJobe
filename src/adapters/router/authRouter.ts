import useFetch from '@/adapters/api/useFetch'
import { useCallback } from 'react'

export type TRole = 'USER' | 'EMPLOYER'

export interface IUser {
  id: number
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  role?: TRole
  profile?: {
    firstName?: string
    lastName?: string
    companyName?: string
    description?: string
  }
}

export interface IRegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  companyName?: string
  role?: TRole
  description?: string
}

export interface ILoginData {
  email: string
  password: string
}

export interface IAuthResponse {
  user?: IUser
  token?: string
  message?: string
}

export interface IRegisterResult {
  user: IUser
  token: string
  message?: string
}

export interface ILoginResult {
  user: IUser
  token: string
  message?: string
}

export interface IUseRegisterReturn {
  data: IUser | null
  loading: boolean
  error: string | null
  register: (userData: IRegisterData) => Promise<IRegisterResult>
}

export interface IUseLoginReturn {
  data: IUser | null
  loading: boolean
  error: string | null
  login: (credentials: ILoginData) => Promise<ILoginResult>
}

export function useRegister(): IUseRegisterReturn {
  const { data, loading, error, refetch } = useFetch<IAuthResponse>(
    '/api/auth/register',
    { method: 'POST' },
    true,
  )

  const register = useCallback(
    async (userData: IRegisterData): Promise<IRegisterResult> => {
      const result: IAuthResponse = await refetch({
        body: JSON.stringify(userData),
      })
      return {
        user: result.user,
        token: result.token,
      }
    },
    [refetch],
  )

  return {
    data: data?.user || null,
    loading,
    error,
    register,
  }
}

export function useLogin(): IUseLoginReturn {
  const { data, loading, error, refetch } = useFetch<IAuthResponse>(
    '/api/auth/login',
    { method: 'POST' },
    true,
  )

  const login = useCallback(
    async (credentials: ILoginData): Promise<ILoginResult> => {
      const result: IAuthResponse = await refetch({
        body: JSON.stringify(credentials),
      })

      return {
        user: result.user,
        token: result.token,
      }
    },
    [refetch],
  )

  return {
    data: data?.user || null,
    loading,
    error,
    login,
  }
}
