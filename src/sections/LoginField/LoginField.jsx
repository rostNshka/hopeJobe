import './LoginField.scss'
import { useState } from 'react'
import { FaRegEye } from 'react-icons/fa6'
import { useLogin } from '@/adapters/router/authRouter'

const LoginField = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [typePassword, setTypePassword] = useState('password')
  const [localError, setLocalError] = useState('')

  const { login, loading } = useLogin()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setLocalError('')
  }

  const showPassword = () => {
    setTypePassword('text')
  }

  const hidePassword = () => {
    setTypePassword('password')
  }

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) return

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result && result.success === true && result.token) {
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))

        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser) {
          if (onSuccess) {
            onSuccess(result.user)
          }
        } else {
          setLocalError('Ошибка сохранения данных')
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
      <div className="login-form__email">
        <label htmlFor="email" className="login-form__label">
          Email
        </label>
        <input
          className={`login-form__input ${localError ? 'login-form__input-error' : null}`}
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="login-form__password">
        <label htmlFor="password" className="login-form__label">
          Пароль
        </label>
        <input
          className={`login-form__input ${localError ? 'login-form__input-error' : null}`}
          type={typePassword}
          id="password"
          name="password"
          placeholder="••••••"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          className="login-form__hide-button"
          type="button"
          onMouseDown={showPassword}
          onMouseUp={hidePassword}
          onMouseLeave={hidePassword}>
          <FaRegEye />
        </button>
      </div>
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
