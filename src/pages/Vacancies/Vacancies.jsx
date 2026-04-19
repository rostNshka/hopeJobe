import VacanciesTitle from '@/components/VacanciesTitle'
import { useVacancy } from '@/adapters/router/vacancyRouter.js'
import './Vacancies.scss'
import Cards from '@/sections/Cards'

const Vacancies = () => {
  const { vacancies, loading, error } = useVacancy()
  return (
    <div className="vacancies">
      <VacanciesTitle />
      {loading && <p className="vacancies__loading">Загрузка вакансий</p>}
      {error && (
        <p className="vacancies__error">
          К сожалению, произошла ошибка: {error} :(
        </p>
      )}
      {!loading && !error && <Cards vacancies={vacancies} />}
    </div>
  )
}

export default Vacancies
