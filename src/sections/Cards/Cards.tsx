import './Cards.scss'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'
import { IVacancyCard } from '@/components/Card/Card.tsx'

interface ICardsProps {
  vacancies: IVacancyCard[]
}

const Cards = ({ vacancies }: ICardsProps) => {
  return (
    <div className="vacancies__cards">
      {vacancies.map((vacancy: IVacancyCard) => (
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
