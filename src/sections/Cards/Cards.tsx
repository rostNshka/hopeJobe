import './Cards.scss'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'
import { ICardProps } from '@/components/Card/Card.tsx'

type IVacancy = ICardProps['vacancies']

interface ICardsProps {
  vacancies: IVacancy[]
}

const Cards = ({ vacancies }: ICardsProps) => {
  return (
    <div className="vacancies__cards">
      {vacancies.map((vacancy, index) => (
        <Link
          key={vacancy.id || index}
          to={`/vacancies/${vacancy.id}`}
          style={{ textDecoration: 'none', display: 'block' }}>
          <Card vacancies={vacancy} />
        </Link>
      ))}
    </div>
  )
}

export default Cards
