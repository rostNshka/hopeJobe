import './MyVacancy.scss'
import { useMyVacancy } from '@/adapters/router/vacancyRouter'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'

const MyVacancy = () => {
  const { vacancies, loading, error } = useMyVacancy()
  return (
    <div className="my-vacancy">
      <h3 className="my-vacancy__title">Мои вакансии</h3>
      <p>Просматривайте и изменяйте свои вакансии.</p>
      {vacancies.map((vacancy) => (
        <div className="my-vacancy__info" key={vacancy.id}>
          <p>Вакансия: {vacancy.title}</p>
          <p>Локация: {vacancy.location}</p>
          <p>Описание: {vacancy.description}</p>
          <p>Тип занятости: {vacancy.workType}</p>
          <p>Зарплата: {vacancy.salary}</p>
          <div>
            <button type="button">
              <FaRegEdit />
            </button>
            <button type="button">
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyVacancy

// title, location, description, workType, salary
