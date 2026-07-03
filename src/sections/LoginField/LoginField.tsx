import './LoginField.scss'
import React, { useState } from 'react'
import { useLogin } from '@/adapters/router/authRouter'
import Field from '@/components/Field'
import { useUser } from '@/context/UserContext'

export interface IUser {
  id: number
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  role?: string
  name?: string
  profile?: {
    firstName?: string
    lastName?: string
    companyName?: string
    description?: string
  }
}

interface ILoginFieldProps {
  onSuccess: (user: IUser) => void
}

interface IFormData {
  email: string
  password: string
}

interface ILoginResult {
  token: string
  user: {
    id: number
    email: string
    name?: string
  }
  message?: string
}

const LoginField = ({ onSuccess }: ILoginFieldProps) => {
  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState<string>('')

  const { login, loading } = useLogin()
  const { setUser, setToken } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev: IFormData) => ({
      ...prev,
      [name]: value,
    }))
    setLocalError('')
  }

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setLocalError('Введите email')
      return false
    }

    if (!formData.password.trim()) {
      setLocalError('Введите пароль')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLocalError('Введите email в формате you@example.com')
      return false
    }

    return true
  }

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, Event>,
  ): Promise<void> => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    try {
      const result = (await login({
        email: formData.email,
        password: formData.password,
      })) as ILoginResult

      if (result && result.token) {
        setToken(result.token)
        setUser(result.user)

        if (onSuccess) {
          onSuccess(result.user)
        }
      } else {
        setLocalError(result?.message || 'Неверный email или пароль')
      }
    } catch (err) {
      setLocalError(err.message || 'Ошибка соединения с сервером')
    }
  }

  return (
    <form id="login-form" onSubmit={handleSubmit}>
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
      {localError ? (
        <div className="login-form__error">{localError}</div>
      ) : null}
      <button type="submit" className="login-form__button" disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  )
}

export default LoginField
