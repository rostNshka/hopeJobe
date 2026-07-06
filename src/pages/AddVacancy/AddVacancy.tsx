import './AddVacancy.scss'
import { CiSquarePlus } from 'react-icons/ci'
import Field from '@/components/Field'
import React, { useState } from 'react'
import { useAddVacancy } from '@/adapters/router/vacancyRouter.ts'
import { EWorkType } from '@/components/WorkType/WorkType.tsx'

export interface IVacancyData {
  title: string
  location: string
  description: string
  workType: string
  salary: string
  message?: string
}

const AddVacancy = () => {
  const [selectedWorkType, setSelectedWorkType] = useState<string>('')

  const [formData, setFormData] = useState<IVacancyData>({
    title: '',
    location: '',
    description: '',
    workType: '',
    salary: '',
  })

  const [salaryDisplay, setSalaryDisplay] = useState<string>('')
  const [localError, setLocalError] = useState<string>('')

  const { addVacancy, loading } = useAddVacancy()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const hasDigits = (str: string) => {
    return /\d/.test(str)
  }

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s-]/g, '')
    setSalaryDisplay(value)
    setFormData(prev => ({ ...prev, salary: value }))
  }

  const handleSalaryBlur = () => {
    if (salaryDisplay && hasDigits(salaryDisplay)) {
      if (!salaryDisplay.includes('₽') || !salaryDisplay.includes('$')) {
        setSalaryDisplay(`${salaryDisplay} ₽`)
      }
    }
  }

  const handleSalaryFocus = () => {
    if (salaryDisplay.includes('₽')) {
      const cleanValue = salaryDisplay.replace(' ₽', '')
      setSalaryDisplay(cleanValue)
      setFormData(prev => ({ ...prev, salary: cleanValue }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setLocalError('Введите название вакансии')
      return false
    }

    if (!formData.location.trim()) {
      setLocalError('Введите местоположение')
      return false
    }

    if (!formData.description.trim()) {
      setLocalError('Введите описание вакансии')
      return false
    }

    if (formData.description.trim().length < 10) {
      setLocalError('Описание должно содержать минимум 10 символов')
      return false
    }

    if (formData.description.trim().length > 2000) {
      setLocalError('Описание не должно превышать 2000 символов')
      return false
    }

    if (!selectedWorkType) {
      setLocalError('Выберите тип работы')
      return false
    }

    if (!formData.salary) {
      setLocalError('Укажите зарплату')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    const dataToSend: IVacancyData = {
      title: formData.title,
      location: formData.location,
      description: formData.description,
      workType: selectedWorkType,
      salary: formData.salary,
    }

    try {
      const result = await addVacancy(dataToSend)
      if (result) {
        setFormData({
          title: '',
          location: '',
          description: '',
          salary: '',
          workType: '',
        })
        setSelectedWorkType('')
        alert('Вакансия успешно добавлена')
      } else {
        setLocalError(result.message || 'Ошибка добавления вакансии')
      }
    } catch (error) {
      setLocalError(error.message || 'Ошибка соединения с сервером')
    }
  }

  const workTypes: Array<{ value: EWorkType; label: string }> = [
    { value: EWorkType.REMOTE, label: 'Удаленно' },
    { value: EWorkType.OFFICE, label: 'Офис' },
    { value: EWorkType.HYBRID, label: 'Гибрид' },
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
      <form className="add-vacancy__form" onSubmit={handleSubmit}>
        <Field
          htmlFor="title"
          label="Название вакансии"
          type="text"
          id="title"
          name="title"
          placeholder="React developer..."
          value={formData.title}
          onChange={handleChange}
        />
        <Field
          htmlFor="location"
          label="Местоположение"
          type="text"
          id="location"
          name="location"
          placeholder="Москва"
          value={formData.location}
          onChange={handleChange}
        />
        <Field
          htmlFor="description"
          label="Описание вакансии"
          type="text"
          id="description"
          name="description"
          placeholder="Мы любим котов..."
          value={formData.description}
          onChange={handleChange}
        />
        <ul className="add-vacancy__work-type">
          {workTypes.map(type => (
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
          placeholder="4000"
          onChange={handleSalaryChange}
          onBlur={handleSalaryBlur}
          onFocus={handleSalaryFocus}
        />
        {localError ? (
          <div className="add-vacancy__error">{localError}</div>
        ) : null}

        <button
          type="submit"
          className="add-vacancy__button"
          disabled={loading}>
          {loading ? 'Загрузка...' : 'Добавить вакансию'}
        </button>
      </form>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default AddVacancy
