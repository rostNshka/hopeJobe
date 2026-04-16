import useFetch from '@/adapters/api/useFetch'

function useVacancy() {
  return useFetch(' http://localhost:4200/api/vacancies', { method: 'GET' })
}

function useVacancyId(id) {
  return useFetch(`http://localhost:4200/api/vacancies/:${id}`, {
    method: 'GET',
  })
}

function useMyVacancy() {
  return useFetch('http://localhost:4200/api/vacancies/employer/my-vacancies', {
    method: 'GET',
  })
}

function useAddVacancy() {
  return useFetch('http://localhost:4200/api/vacancies', { method: 'POST' })
}

function useUpdateVacancy(id) {
  return useFetch(`http://localhost:4200/api/vacancies/:${id}`, {
    method: 'PUT',
  })
}

function useDeleteVacancy(id) {
  return useFetch(`http://localhost:4200/api/vacancies/:${id}`, {
    method: 'DELETE',
  })
}

export default {
  useVacancy,
  useVacancyId,
  useMyVacancy,
  useAddVacancy,
  useUpdateVacancy,
  useDeleteVacancy,
}
