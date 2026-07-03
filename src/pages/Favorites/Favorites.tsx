import './Favorites.scss'
import { useGetResponses } from '@/adapters/router/responseRouter'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'

const Favorites = () => {
  const { vacancies, loading, error, refetch } = useGetResponses()

  if (loading) {
    return (
      <div className="favorites">
        <div className="favorites__loading">Загрузка избранных вакансий...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="favorites">
        <div className="favorites__error">Ошибка: {error}</div>
      </div>
    )
  }

  if (!vacancies.length) {
    return (
      <div className="favorites">
        <h3 className="favorites__title">Избранные вакансии</h3>
        <div className="favorites__empty">
          <p>У вас пока нет избранных вакансий</p>
          <Link to="/" className="favorites__link">
            Перейти к вакансиям
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites">
      <h3 className="favorites__title">Избранные вакансии</h3>
      <p className="favorites__subtitle">
        Здесь хранятся вакансии, которые вы добавили в избранное
      </p>
      <div className="favorites__items">
        {vacancies.map((vacancy) => (
          <Link
            key={vacancy.id}
            to={`/vacancies/${vacancy.id}`}
            style={{ textDecoration: 'none', display: 'block' }}>
            <Card
              vacancies={vacancy}
              onFavoriteChange={(): Promise<void> => refetch()}
            />
          </Link>
        ))}
      </div>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default Favorites
