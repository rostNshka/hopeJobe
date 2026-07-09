import './LoginField.scss'
import React, { useState, ChangeEvent } from 'react'
import { useLogin } from '@/adapters/router/authRouter'
import Field from '@/components/Field'
import { useUser } from '@/context/UserContext.tsx'
import { ILoginFieldProps } from './LoginFieldProps'
import { IUserAssets, TRole } from '@/types/entities/user.types'

const LoginField = ({ onSuccess }: ILoginFieldProps) => {
  const [formData, setFormData] = useState<IUserAssets>({
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState<string>('')

  const { execute: login, loading } = useLogin()
  const { setUser, setToken } = useUser()

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

      if (result?.token && result?.user) {
        setToken(result.token)

        const { id, email, role, profile = {} } = result.user

        setUser({
          id,
          email,
          role: role as TRole,
          ...profile,
        })

        if (onSuccess) {
          onSuccess({
            email,
            password: formData.password,
            role: role as TRole,
            ...profile,
          })
        }
      } else {
        setLocalError(result?.message || 'Неверный email или пароль')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLocalError('Ошибка соединения с сервером')
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
