import useFetch from '@/adapters/api/useFetch'
import { IProfileResponse, IStats } from '@/types/entities/api.types'
import { IUserData } from '@/types/entities/user.types'

export function useProfile(skipFetch = false) {
  const { data, loading, error, refetch } = useFetch<IProfileResponse>(
    '/api/users/profile',
    {
      method: 'GET',
    },
    skipFetch
  )

  return {
    profile: data?.data || null,
    loading,
    error,
    refetch,
  }
}

export function useProfileUpdate() {
  const { data, loading, error, refetch } = useFetch<IProfileResponse>(
    '/api/users/profile',
    {
      method: 'PUT',
    },
    true
  )

  const updateProfile = async (updateData: IUserData) => {
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
    { method: 'GET' }
  )

  return {
    stats: data?.data || null,
    loading,
    error,
    refetch,
  }
}
