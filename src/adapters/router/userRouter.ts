import { useEffect } from 'react'
import useFetch from '@/adapters/api/useFetch'
import { IProfileResponse, IStats } from '@/types/entities/api.types'
import { IUserData } from '@/types/entities/user.types'
import { userStore } from '@/stores/user-store'

export function useProfile() {
  const { data, loading, error, refetch } = useFetch<IProfileResponse>(
    userStore.isAuthenticated ? '/users/profile' : undefined,
    {
      method: 'GET',
    }
  )

  useEffect(() => {
    if (!userStore.loading && userStore.accessToken) {
      refetch()
    }
  }, [userStore.loading, userStore.accessToken, refetch])

  return {
    profile: data?.data || null,
    loading,
    error,
    refetch,
  }
}

export function useProfileUpdate() {
  const { data, loading, error, refetch } = useFetch<IProfileResponse>(
    '/users/profile',
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
  const { data, loading, error, refetch } = useFetch<IStats>('/users/stats', {
    method: 'GET',
  })

  return {
    stats: data?.data || null,
    loading,
    error,
    refetch,
  }
}
