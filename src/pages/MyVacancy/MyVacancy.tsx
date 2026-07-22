import './MyVacancy.scss'
import {
  useDeleteVacancy,
  useMyVacancy,
  useUpdateVacancy,
} from '@/adapters/router/vacancyRouter.ts'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import React, { useState } from 'react'
import Field from '@/components/Field'
import {
  EWorkType,
  IVacancyCreateData,
  IVacancy,
} from '@/types/entities/vacancy.types'
import { observer } from 'mobx-react-lite'
import toastStore from '@/stores/toast-store'

const MyVacancy = observer(() => {
  const [editingId, setEditingId] = useState<number | undefined>(undefined)
  const [editFormData, setEditFormData] = useState<IVacancyCreateData>({
    title: '',
    description: '',
    location: '',
    workType: EWorkType.REMOTE,
    salary: '',
  })

  const { vacancies, loading, error, refetch } = useMyVacancy()
  const { deleteVacancy } = useDeleteVacancy()
  const { updateVacancy, loading: updateLoading } = useUpdateVacancy()

  const getWorkType = (type: EWorkType) => {
    return type === 'REMOTE'
      ? 'Удаленная'
      : type === 'OFFICE'
        ? 'Офис'
        : 'Гибридная'
  }

  const handleEditClick = (vacancy: IVacancy) => {
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
    >
  ) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (id: number) => {
    const result = await updateVacancy(id, {
      ...editFormData,
      description: editFormData.description,
    })
    if (result) {
      setEditingId(undefined)
      refetch()
    } else {
      toastStore.showError('Ошибка обновления')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(undefined)
    setEditFormData({
      title: '',
      description: '',
      location: '',
      workType: EWorkType.REMOTE,
      salary: '',
    })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      const result = await deleteVacancy(id)
      if (result) {
        refetch()
      } else {
        toastStore.showError('Ошибка удаления')
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
        {vacancies.map((vacancy: IVacancy) => (
          <div className="my-vacancy__item" key={vacancy.id}>
            {editingId !== vacancy.id ? (
              <div>
                <p>Вакансия: {vacancy.title}</p>
                <p>Описание: {vacancy.description || 'Нет описания'}</p>
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
                  value={editFormData.description || ''}
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
                    aria-label="Тип занятости"
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
                  aria-label="Редактировать"
                  type="button"
                  className="my-vacancy__button edit"
                  onClick={() => handleEditClick(vacancy)}>
                  <FaRegEdit />
                </button>
              )}
              {editingId !== vacancy.id && (
                <button
                  aria-label="Удалить"
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
})

export default MyVacancy
