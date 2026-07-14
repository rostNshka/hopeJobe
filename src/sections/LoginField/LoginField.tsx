import './LoginField.scss'
import React, { useState, ChangeEvent } from 'react'
import { useLogin } from '@/adapters/router/authRouter'
import Field from '@/components/Field'
import { userStore } from '@/stores/user-store'
import { ILoginFieldProps } from './LoginFieldProps'
import { IUserAssets, TRole } from '@/types/entities/user.types'

const LoginField = ({ onSuccess }: ILoginFieldProps) => {
  const [formData, setFormData] = useState<IUserAssets>({
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState<string>('')

  const { execute: login, loading } = useLogin()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const { name, value } = target
    setFormData((prev: IUserAssets) => ({
      ...prev,
      [name]: value,
    }))
    setLocalError('')
  }

  const validateForm = (): boolean => {
    if (!formData?.email?.trim()) {
      setLocalError('Введите email')
      return false
    }

    if (!formData?.password?.trim()) {
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
    e: React.SyntheticEvent<HTMLFormElement, Event>
  ): Promise<void> => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    try {
      const result = await login(formData)
      if (!result) {
        setLocalError('Неверный email или пароль')
        return
      }

      if (result?.token && result?.user) {
        userStore.setToken(result.token)

        const { id, email, role, profile = {} } = result.user

        const userData = {
          id,
          email,
          role: role as TRole,
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
          patronymic: profile?.patronymic || '',
          companyName: profile?.companyName || '',
          description: profile?.description || '',
        }

        userStore.setUser(userData)

        if (onSuccess) {
          onSuccess(userData)
        }
      } else if (result?.message) {
        setLocalError(result.message)
      } else {
        setLocalError('Неверный email или пароль')
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Сессия истекла') ||
          error.message.includes('401') ||
          error.message.includes('Неверные данные') ||
          error.message.includes('Неверный email')
        ) {
          setLocalError('Неверный email или пароль')
        } else {
          setLocalError(error.message || 'Ошибка соединения с сервером')
        }
      } else {
        setLocalError('Ошибка соединения с сервером')
      }
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
