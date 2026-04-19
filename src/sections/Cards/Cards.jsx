import './Cards.scss'
import Card from '@/components/Card'

const Cards = (props) => {
  const { vacancies } = props
  return (
    <div className="vacancies__cards">
      {vacancies.map((vacancies, index) => (
        <div key={index}>
          <Card vacancies={vacancies} />
        </div>
      ))}
    </div>
  )
}

export default Cards
