import './AddVacancy.scss'
import { CiSquarePlus } from 'react-icons/ci'
import Field from '@/components/Field'
import { useState } from 'react'

const AddVacancy = () => {
  const [selectedWorkType, setSelectedWorkType] = useState('')

  const workTypes = [
    { value: 'REMOTE', label: 'Удаленно' },
    { value: 'OFFICE', label: 'Офис' },
    { value: 'HYBRID', label: 'Гибрид' },
  ]

  return (
    <div className="add-vacancy">
      <div className="add-vacancy__title">
        <CiSquarePlus />
        <h4>Новая вакансия</h4>
      </div>
      <div className="add-vacancy__description">
        Заполните форму, чтобы опубликовать вакансию
      </div>
      <form className="add-vacancy__form">
        <Field
          htmlFor="title"
          label="Название вакансии"
          type="text"
          id="title"
          name="title"
          placeholder="React developer..."
        />
        <Field
          htmlFor="location"
          label="Местоположение"
          type="text"
          id="location"
          name="location"
          placeholder="Москва"
        />
        <Field
          htmlFor="description"
          label="Описание вакансии"
          type="text"
          id="description"
          name="description"
          placeholder="Мы любим котов..."
        />
        <ul className="add-vacancy__work-type">
          {workTypes.map((type) => (
            <li key={type.value} className="add-vacancy__work-type-item">
              <button
                type="button"
                className={selectedWorkType === type.value ? 'active' : ''}
                onClick={() => setSelectedWorkType(type.value)}>
                {type.label}
              </button>
            </li>
          ))}
        </ul>
        <Field
          htmlFor="salary"
          label="Зарплата"
          type="text"
          id="salary"
          name="salary"
          placeholder="4000$"
        />
        <button type="submit" className="add-vacancy__button">
          Добавить вакансию
        </button>
      </form>
    </div>
  )
}

export default AddVacancy
