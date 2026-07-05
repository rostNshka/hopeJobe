import useFetch from '@/adapters/api/useFetch'
import { TRole } from '@/adapters/router/authRouter.ts'
import {
  IProfileData,
  IUpdateData,
} from '@/sections/ProfileModal/ProfileModal.tsx'

export interface IProfile extends IProfileData {
  data: {
    firstName?: string
    lastName?: string
    patronymic?: string
    companyName?: string
    description?: string
    user?: {
      createdAt?: string
      role?: TRole
      email?: string
    }
  }
}

interface IStats {
  data: {
    employers: number
    total: number
  }
}

export function useProfile(skipFetch = false) {
  const { data, loading, error, refetch } = useFetch<IProfile>(
    '/api/users/profile',
    {
      method: 'GET',
    },
    skipFetch,
  )

  return {
    profile: data?.data || null,
    loading,
    error,
    refetch,
  }
}

export function useProfileUpdate() {
  const { data, loading, error, refetch } = useFetch<IProfile>(
    '/api/users/profile',
    {
      method: 'PUT',
    },
    true,
  )

  const updateProfile = async (updateData: IUpdateData) => {
    try {
      const result = await refetch({
        body: JSON.stringify(updateData),
      })
      return result
    } catch (err) {
      return err
    }
  }

  return {
    updatedProfile: data?.data || null,
    loading,
    error,
    updateProfile,
  }
}

export function useStatistics() {
  const { data, loading, error, refetch } = useFetch<IStats>(
    '/api/users/stats',
    { method: 'GET' },
  )

  return {
    stats: data?.data || null,
    loading,
    error,
    refetch,
  }
}
