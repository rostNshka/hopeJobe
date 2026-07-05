import './ProfileModal.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile, useProfileUpdate } from '@/adapters/router/userRouter'
import Field from '@/components/Field'
import { useUser } from '@/context/UserContext.tsx'
import { IUser } from '@/sections/LoginField/LoginField.tsx'

interface IProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  userId: IUser
}

export interface IProfileData {
  firstName?: string
  lastName?: string
  patronymic?: string
  companyName?: string
  description?: string
}

export interface IUpdateData {
  companyName?: string
  description?: string
  firstName?: string
  lastName?: string
  patronymic?: string
}

const ProfileModal = ({ isOpen, onClose, userId }: IProfileModalProps) => {
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDivElement>(null)
  const { logout } = useUser()

  const { profile, loading, error, refetch } = useProfile(true)
  const { updateProfile, loading: updateLoading } = useProfileUpdate()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localError, setLocalError] = useState<string>('')
  const [formData, setFormData] = useState<IProfileData>({
    firstName: '',
    lastName: '',
    patronymic: '',
    companyName: '',
    description: '',
  })

  useEffect(() => {
    if (isOpen && userId) {
      refetch()
    }
  }, [isOpen, userId, refetch])

  useEffect(() => {
    if (profile) {
      if (profile.companyName !== undefined) {
        setFormData({
          firstName: '',
          lastName: '',
          patronymic: '',
          companyName: profile.companyName || '',
          description: profile.description || '',
        })
      } else {
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          patronymic: profile.patronymic || '',
          companyName: '',
          description: '',
        })
      }
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError('')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose()
  }

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, Event>,
  ) => {
    e.preventDefault()
    setLocalError('')

    const updateData: IUpdateData = {}

    if (profile.companyName !== undefined) {
      if (formData.companyName !== profile.companyName) {
        updateData.companyName = formData.companyName
      }
      if (formData.description !== profile.description) {
        updateData.description = formData.description
      }
    } else {
      if (formData.firstName !== profile.firstName) {
        updateData.firstName = formData.firstName
      }
      if (formData.lastName !== profile.lastName) {
        updateData.lastName = formData.lastName
      }
      if (formData.patronymic !== profile.patronymic) {
        updateData.patronymic = formData.patronymic
      }
    }

    if (Object.keys(updateData).length > 0) {
      try {
        await updateProfile(updateData)
        await refetch()
        setIsEditing(false)
      } catch (error) {
        setLocalError(`Ошибка обновления: ${error.message || error}`)
      }
    } else {
      setIsEditing(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  if (loading) {
    return (
      <div className="profile-modal">
        <div className="profile-modal__content" ref={modalRef}>
          <div className="profile-modal__loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-modal">
        <div className="profile-modal__content" ref={modalRef}>
          <div className="profile-modal__error">
            <p>Ошибка: {error}</p>
            <button onClick={void refetch()}>Попробовать снова</button>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-modal">
        <div className="profile-modal__content" ref={modalRef}>
          <div className="profile-modal__empty">Нет данных профиля</div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-modal">
      <div className="profile-modal__content" ref={modalRef}>
        <div className="profile-modal__body">
          <div className="profile-info">
            <p>
              <strong>Email:</strong> {profile.user?.email || ''}
            </p>
            <p>
              <strong>Роль:</strong>{' '}
              {profile.user?.role === 'USER' ? 'Кандидат' : 'Работодатель'}
            </p>
            <p>
              <strong>Дата регистрации:</strong>{' '}
              {profile.user?.createdAt
                ? new Date(profile.user.createdAt).toLocaleDateString()
                : '—'}
            </p>
          </div>
          {!isEditing ? (
            <>
              <div className="profile-details">
                {profile.companyName !== undefined ? (
                  <div className="profile-details__info">
                    <p>
                      Компания: {profile.companyName || 'Здесь пока ничего нет'}
                    </p>
                    <p>
                      Описание: {profile.description || 'Здесь пока ничего нет'}
                    </p>
                  </div>
                ) : (
                  <div className="profile-details__info">
                    <p>Имя: {profile.firstName || 'Здесь пока ничего нет'}</p>
                    <p>
                      Фамилия: {profile.lastName || 'Здесь пока ничего нет'}
                    </p>
                    <p>
                      Отчество: {profile.patronymic || 'Здесь пока ничего нет'}
                    </p>
                  </div>
                )}
              </div>
              <div className="profile-modal__buttons">
                <button
                  className="profile-modal__buttons__edit-btn"
                  onClick={() => setIsEditing(true)}>
                  Редактировать
                </button>
                <button
                  className="profile-modal__buttons__logout"
                  onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              {profile.companyName !== undefined ? (
                <div className="profile-form__fields">
                  <Field
                    htmlFor="companyName"
                    label="Название компании"
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Введите название компании"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                  <Field
                    htmlFor="description"
                    label="Описание"
                    type="description"
                    id="description"
                    name="description"
                    placeholder="Введите описание компании"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <>
                  <Field
                    htmlFor="firstName"
                    label="Имя"
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Введите имя"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Field
                    htmlFor="lastName"
                    label="Фамилия"
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Введите фамилию"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <Field
                    htmlFor="patronymic"
                    label="Отчество"
                    type="text"
                    id="patronymic"
                    name="patronymic"
                    placeholder="Введите отчество"
                    value={formData.patronymic}
                    onChange={handleChange}
                  />
                </>
              )}

              {localError && (
                <div className="profile-modal__error">{localError}</div>
              )}

              <div className="profile-modal__buttons">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="profile-modal__buttons__save">
                  {updateLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  className="profile-modal__buttons__cancel"
                  onClick={() => setIsEditing(false)}>
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
