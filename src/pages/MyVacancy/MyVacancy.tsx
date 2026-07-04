import './MyVacancy.scss'
import {
  useDeleteVacancy,
  useMyVacancy,
  useUpdateVacancy,
} from '@/adapters/router/vacancyRouter'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import React, { useState } from 'react'
import Field from '@/components/Field'
import { EWorkType } from '@/components/WorkType/WorkType.tsx'

interface IEditFormData {
  title: string
  description: string
  location: string
  workType: EWorkType | ''
  salary: string
}

const MyVacancy = () => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<IEditFormData>({
    title: '',
    description: '',
    location: '',
    workType: '',
    salary: '',
  })

  const { vacancies, loading, error, refetch } = useMyVacancy()
  const { deleteVacancy } = useDeleteVacancy()
  const { updateVacancy, loading: updateLoading } = useUpdateVacancy()

  const getWorkType = (type: any) => {
    return type === 'REMOTE'
      ? 'Удаленная'
      : type === 'OFFICE'
        ? 'Офис'
        : 'Гибридная'
  }

  const handleEditClick = (vacancy: any) => {
    setEditingId(vacancy.id)
    setEditFormData({
      title: vacancy.title,
      description: vacancy.description,
      location: vacancy.location,
      workType: vacancy.workType,
      salary: vacancy.salary,
    })
  }

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (id: number) => {
    const result = await updateVacancy(id, editFormData)
    if (result) {
      setEditingId(null)
      refetch()
    } else {
      alert(result.message || 'Ошибка обновления')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData({
      title: '',
      description: '',
      location: '',
      workType: '',
      salary: '',
    })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      const result = await deleteVacancy(id)
      if (result) {
        refetch()
      } else {
        alert(result.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="my-vacancy">
        <h3 className="my-vacancy__title">Мои вакансии</h3>
        <p>Просматривайте и изменяйте свои вакансии.</p>
        <div className="my-vacancy__loading">Загрузка вакансий...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-vacancy">
        <h3 className="my-vacancy__title">Мои вакансии</h3>
        <p>Просматривайте и изменяйте свои вакансии.</p>
        <div className="my-vacancy__error">Ошибка: {error}</div>
      </div>
    )
  }

  if (!vacancies.length) {
    return (
      <div className="my-vacancy">
        <h3 className="my-vacancy__title">Мои вакансии</h3>
        <p>Просматривайте и изменяйте свои вакансии.</p>
        <div className="my-vacancy__empty">У вас пока нет вакансий</div>
      </div>
    )
  }

  return (
    <div className="my-vacancy">
      <h3 className="my-vacancy__title">Мои вакансии</h3>
      <p>Просматривайте и изменяйте свои вакансии.</p>
      <div className="my-vacancy__items">
        {vacancies.map((vacancy: any) => (
          <div className="my-vacancy__item" key={vacancy.id}>
            {editingId !== vacancy.id ? (
              <div>
                <p>Вакансия: {vacancy.title}</p>
                <p>Описание: {vacancy.description}</p>
                <p>Локация: {vacancy.location}</p>
                <p>Тип занятости: {getWorkType(vacancy.workType)}</p>
                <p>Зарплата: {vacancy.salary}</p>
              </div>
            ) : (
              <div>
                <p>Вакансия: {vacancy.title}</p>

                <Field
                  htmlFor="description"
                  label="Описание"
                  type="text"
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                />

                <Field
                  htmlFor="location"
                  label="Локация"
                  type="text"
                  id="location"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                />
                <p>
                  Тип занятости:
                  <select
                    name="workType"
                    value={editFormData.workType}
                    onChange={handleEditChange}
                    className="my-vacancy__edit-select">
                    <option value="REMOTE">Удаленная</option>
                    <option value="OFFICE">Офис</option>
                    <option value="HYBRID">Гибридная</option>
                  </select>
                </p>

                <Field
                  htmlFor="salary"
                  label="Зарплата"
                  type="text"
                  id="salary"
                  name="salary"
                  value={editFormData.salary}
                  onChange={handleEditChange}
                />
                <div className="my-vacancy__edit-buttons">
                  <button
                    type="button"
                    onClick={() => handleUpdate(vacancy.id)}
                    disabled={updateLoading}
                    className="my-vacancy__save-button">
                    {updateLoading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="my-vacancy__cancel-button">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="my-vacancy__buttons">
              {editingId !== vacancy.id && (
                <button
                  type="button"
                  className="my-vacancy__button edit"
                  onClick={() => handleEditClick(vacancy)}>
                  <FaRegEdit />
                </button>
              )}
              {editingId !== vacancy.id && (
                <button
                  type="button"
                  className="my-vacancy__button delete"
                  onClick={() => handleDelete(vacancy.id)}>
                  <MdDeleteOutline />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default MyVacancy
