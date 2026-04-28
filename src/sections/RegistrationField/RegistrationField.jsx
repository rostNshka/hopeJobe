import './RegistrationField.scss'
import Field from '@/components/Field'

const RegistrationField = ({ role }) => {
  return (
    <form id="registration-form">
      <Field
        htmlFor="email"
        label="Email"
        type="email"
        id="email"
        name="email"
        placeholder="you@example.com"
      />
      <Field
        htmlFor="password"
        label="Пароль"
        type="password"
        id="password"
        name="password"
        placeholder="••••••"
      />
      {role === 'candidate' ? (
        <Field
          htmlFor="firstName"
          label="Имя"
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Иван"
        />
      ) : (
        <Field
          htmlFor="companyName"
          label="Название компании"
          type="text"
          id="companyName"
          name="companyName"
          placeholder="Название компании"
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
        />
      ) : (
        <Field
          htmlFor="description"
          label="Дополнительная информация"
          type="text"
          id="description"
          name="description"
          placeholder="Мы любим котов и код..."
        />
      )}
      <button type="submit" className="registration-form__button">
        Зарегистрироваться
      </button>
    </form>
  )
}

export default RegistrationField
