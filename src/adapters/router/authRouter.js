import useFetch from '@/adapters/api/useFetch'

function useRegister() {
  return useFetch(' http://localhost:4200/api/auth/register', {
    method: 'POST',
  })
}

function useLogin() {
  return useFetch(' http://localhost:4200/api/auth/login', {
    method: 'POST',
  })
}

export default { useRegister, useLogin }
