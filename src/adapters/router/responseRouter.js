import useFetch from '@/adapters/api/useFetch'

function useGetResponses() {
  return useFetch(' http://localhost:4200/api/responses', { method: 'GET' })
}

function useAddResponses() {
  return useFetch(' http://localhost:4200/api/responses', { method: 'POST' })
}

function useDeleteResponses() {
  return useFetch(' http://localhost:4200/api/responses', { method: 'DELETE' })
}

function useCheckResponses() {
  return useFetch(' http://localhost:4200/api/responses/check/:vacancyId', {
    method: 'GET',
  })
}

export default {
  useGetResponses,
  useAddResponses,
  useDeleteResponses,
  useCheckResponses,
}
