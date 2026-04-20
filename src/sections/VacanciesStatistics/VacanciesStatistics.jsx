import './VacanciesStatistics.scss'
import { useVacancy } from '@/adapters/router/vacancyRouter.js'
import { FaBriefcase } from 'react-icons/fa'
import { LiaUserTieSolid, LiaUserFriendsSolid } from 'react-icons/lia'
import { useStatistics } from '@/adapters/router/userRouter'

const VacanciesStatistics = () => {
  const { vacancies } = useVacancy()
  const { stats } = useStatistics()
  return (
    <div className="vacancies-statistics">
      <div className="vacancies-statistics__item">
        <div className="vacancies-statistics__item-icon">
          <FaBriefcase />
          {vacancies.length}
        </div>
        вакансий
      </div>
      <div className="vacancies-statistics__item">
        <div className="vacancies-statistics__item-icon">
          <LiaUserTieSolid />
          {stats.employers}
        </div>
        работодателей
      </div>
      <div className="vacancies-statistics__item">
        <div className="vacancies-statistics__item-icon">
          <LiaUserFriendsSolid />
          {stats.total}
        </div>
        пользователей
      </div>
    </div>
  )
}

export default VacanciesStatistics
