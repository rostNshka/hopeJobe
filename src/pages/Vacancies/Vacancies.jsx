import VacanciesTitle from '@/sections/VacanciesTitle'
import { useVacancy } from '@/adapters/router/vacancyRouter.js'
import './Vacancies.scss'
import Cards from '@/sections/Cards'
import VacanciesInput from '@/sections/VacanciesInput'
import { useMemo, useState } from 'react'
import VacanciesStatistics from '@/sections/VacanciesStatistics'

const Vacancies = () => {
  const { vacancies, loading, error } = useVacancy()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVacancies = useMemo(() => {
    if (!vacancies) {
      return []
    }
    if (!searchTerm.trim()) {
      return vacancies
    }

    const lowerSearchTerm = searchTerm.toLowerCase()

    return vacancies.filter((vacancy) => {
      return (
        vacancy.title?.toLowerCase().includes(lowerSearchTerm) ||
        vacancy.employer?.companyName.toLowerCase().includes(lowerSearchTerm) ||
        vacancy.description?.toLowerCase().includes(lowerSearchTerm) ||
        vacancy.location?.toLowerCase().includes(lowerSearchTerm)
      )
    })
  }, [vacancies, searchTerm])

  return (
    <div className="vacancies">
      <VacanciesTitle />
      <VacanciesInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <VacanciesStatistics />

      {loading && <p className="vacancies__loading">Загрузка вакансий</p>}

      {error && (
        <p className="vacancies__error">
          К сожалению, произошла ошибка: {error} :(
        </p>
      )}

      {!loading && !error && (
        <>
          {filteredVacancies.length === 0 ? (
            <p className="vacancies__empty">
              По вашему запросу ничего не найдено
            </p>
          ) : (
            <Cards vacancies={filteredVacancies} />
          )}
        </>
      )}
    </div>
  )
}

export default Vacancies
