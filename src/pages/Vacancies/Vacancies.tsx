import VacanciesTitle from '@/sections/VacanciesTitle'
import { useVacancy } from '@/adapters/router/vacancyRouter.js'
import './Vacancies.scss'
import Cards from '@/sections/Cards'
import VacanciesInput from '@/sections/VacanciesInput'
import { useMemo, useState, useRef, useEffect } from 'react'
import VacanciesStatistics from '@/sections/VacanciesStatistics'
import { IVacancy } from '@/types/entities/vacancy.types'

const Vacancies = () => {
  const { vacancies, loading, error } = useVacancy()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [searchTerm])

  const filteredVacancies = useMemo((): IVacancy[] => {
    if (!vacancies) {
      return []
    }
    if (!debouncedSearchTerm.trim()) {
      return vacancies
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase()

    return vacancies.filter(vacancy => {
      return (
        vacancy.title?.toLowerCase().includes(lowerSearchTerm) ||
        vacancy.employer?.companyName.toLowerCase().includes(lowerSearchTerm) ||
        vacancy.description?.toLowerCase().includes(lowerSearchTerm) ||
        vacancy.location?.toLowerCase().includes(lowerSearchTerm)
      )
    })
  }, [vacancies, debouncedSearchTerm])

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
