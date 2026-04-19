import './Card.scss'
import { CiLocationOn } from 'react-icons/ci'
import Avatar from '@/components/Avatar'
import WorkType from '@/components/WorkType'

const Card = (props) => {
  const { vacancies } = props
  return (
    <div className="card">
      <div className="card-header">
        <Avatar name={vacancies.employer?.companyName} />
        <div className="card-header-info">
          <div className="card-header-info__company-name">
            {vacancies.employer?.companyName}
          </div>
          <div className="card-header-info__location">
            <CiLocationOn />
            {vacancies.location}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="card-body__title">{vacancies.title}</div>
        <span className="card-body__salary">{vacancies.salary}</span>
        <WorkType workType={vacancies.workType} />
      </div>
    </div>
  )
}

export default Card
