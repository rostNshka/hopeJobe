import useFetch from '@/adapters/api/useFetch'

function useProfile() {
  return useFetch(' http://localhost:4200/api/users/profile', { method: 'GET' })
}

function useProfileUpdate() {
  return useFetch(' http://localhost:4200/api/users/profile', { method: 'PUT' })
}

export default { useProfile, useProfileUpdate }
