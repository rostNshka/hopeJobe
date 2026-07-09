import './Cards.scss'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'
import { CardsProps } from './CardsProps'
import { IVacancyInfo } from '@/types/entities/vacancy.types'

const Cards = ({ vacancies }: CardsProps) => {
  return (
    <div className="vacancies__cards">
      {vacancies.map((vacancy: IVacancyInfo) => (
        <Link
          key={vacancy.id}
          to={`/vacancies/${vacancy.id}`}
          style={{ textDecoration: 'none', display: 'block' }}>
          <Card vacancy={vacancy} />
        </Link>
      ))}
    </div>
  )
}

export default Cards
