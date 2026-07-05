import useFetch from '@/adapters/api/useFetch'

interface IProfile {
  data: {
    firstName?: string
    lastName?: string
    patronymic?: string
    companyName?: string
    description?: string
  }
}

interface IStats {
  employers: number
  total: number
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

  const updateProfile = async (updateData: IProfile) => {
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
    updatedProfile: data || null,
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
    stats: data || null,
    loading,
    error,
    refetch,
  }
}
