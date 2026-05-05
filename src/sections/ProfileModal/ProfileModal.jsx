import './ProfileModal.scss'
import { useEffect, useRef, useState } from 'react'
import { useProfile, useProfileUpdate } from '@/adapters/router/userRouter'
import Field from '@/components/Field'

const ProfileModal = (props) => {
  const { isOpen, onClose, userId } = props
  const modalRef = useRef(null)

  const { profile, loading, error, refetch } = useProfile(true)
  const { updateProfile, loading: updateLoading } = useProfileUpdate()

  const [isEditing, setIsEditing] = useState(false)
  const [localError, setLocalError] = useState('')
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError('')
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    const updateData = {}

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
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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
    const handleEscape = (event) => {
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

  if (!isOpen) return null

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
            <button onClick={refetch}>Попробовать снова</button>
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
        <div className="profile-modal__header">
          <h2>Профиль пользователя</h2>
        </div>
        <div className="profile-modal__body">
          <div className="profile-info">
            <p>Email: {profile.user?.email || ''}</p>
            <p>
              Роль:{' '}
              {profile.user?.role === 'USER' ? 'Кандидат' : 'Работодатель'}
            </p>
            <p>
              Дата регистрации:{' '}
              {profile.user?.createdAt
                ? new Date(profile.user.createdAt).toLocaleDateString()
                : '—'}
            </p>
          </div>
          {!isEditing ? (
            <>
              <div className="profile-details">
                <h3>Личная информация</h3>
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
              <button
                className="profile-modal__edit-btn"
                onClick={() => setIsEditing(true)}>
                Редактировать
              </button>
              <button className="profile-modal__logout" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <h3>Редактирование профиля</h3>
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
                <div className="profile-form__error">{localError}</div>
              )}

              <div className="profile-form__buttons">
                <button type="submit" disabled={updateLoading}>
                  {updateLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
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
