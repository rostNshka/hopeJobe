import './RegistrationField.scss'
import Field from '@/components/Field'
import { useState } from 'react'
import { useRegister } from '@/adapters/router/authRouter'

const RegistrationField = ({ role, onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    companyName: '',
    description: '',
  })
  const [localError, setLocalError] = useState('')

  const { register, loading } = useRegister()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    let dataToSend = {
      email: formData.email,
      password: formData.password,
    }

    if (role === 'employer') {
      dataToSend = {
        ...dataToSend,
        role: 'EMPLOYER',
        companyName: formData.companyName,
        description: formData.description || null,
      }
    } else {
      dataToSend = {
        ...dataToSend,
        role: 'USER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        patronymic: formData.patronymic || null,
      }
    }
    try {
      const result = await register(dataToSend)
      if (result && result.success === true) {
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          patronymic: '',
          companyName: '',
          description: '',
        })
        if (onSuccess) {
          onSuccess(result.user)
          onSwitchToLogin()
        }
      } else {
        setLocalError(result?.message || 'Ошибка регистрации')
      }
    } catch (err) {
      setLocalError(err.message || 'Ошибка соединения с сервером')
    }
  }
  return (
    <form id="registration-form" onSubmit={handleSubmit}>
      <Field
        htmlFor="email"
        label="Email"
        type="email"
        id="email"
        name="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
      />
      <Field
        htmlFor="password"
        label="Пароль"
        type="password"
        id="password"
        name="password"
        placeholder="••••••"
        value={formData.password}
        onChange={handleChange}
      />
      {role === 'candidate' ? (
        <Field
          htmlFor="firstName"
          label="Имя"
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Иван"
          value={formData.firstName}
          onChange={handleChange}
        />
      ) : (
        <Field
          htmlFor="companyName"
          label="Название компании"
          type="text"
          id="companyName"
          name="companyName"
          placeholder="Название компании"
          value={formData.companyName}
          onChange={handleChange}
        />
      )}

      {role === 'candidate' ? (
        <Field
          htmlFor="lastName"
          label="Фамилия"
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Иванов"
          value={formData.lastName}
          onChange={handleChange}
        />
      ) : null}

      {role === 'candidate' ? (
        <Field
          htmlFor="patronymic"
          label="Отчество"
          type="text"
          id="patronymic"
          name="patronymic"
          placeholder="Иванович"
          value={formData.patronymic}
          onChange={handleChange}
        />
      ) : (
        <Field
          htmlFor="description"
          label="Дополнительная информация"
          type="text"
          id="description"
          name="description"
          placeholder="Мы любим котов и код..."
          value={formData.description}
          onChange={handleChange}
        />
      )}
      {localError ? (
        <div className="registration-form__error">{localError}</div>
      ) : null}

      <button
        type="submit"
        className="registration-form__button"
        disabled={loading}>
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  )
}

export default RegistrationField
