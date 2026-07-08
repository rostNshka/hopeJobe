import './Field.scss'
import { FaRegEye } from 'react-icons/fa6'
import { useState } from 'react'
import { FieldProps, TypePassword } from './FieldProps'

const Field = ({
  htmlFor,
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
}: FieldProps) => {
  const [typePassword, setTypePassword] = useState<TypePassword>('password')

  const showPassword = () => {
    setTypePassword('text')
  }

  const hidePassword = () => {
    setTypePassword('password')
  }

  const isPassword = id === 'password' || type === 'password'

  return (
    <div className={`field field__${name}`}>
      <label htmlFor={htmlFor} className="field__label">
        {label}
      </label>
      {name === 'description' ? (
        <textarea
          name={name}
          id={id}
          className="field__text"
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={onChange}></textarea>
      ) : (
        <input
          type={type === 'password' ? typePassword : type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="field__input"
          value={value}
          onChange={onChange}
          autoComplete="on"
          onFocus={onFocus}
          onBlur={onBlur}
        />
      )}
      {isPassword && (
        <button
          aria-label="Показать пароль"
          className="field__button"
          type="button"
          onMouseDown={showPassword}
          onMouseUp={hidePassword}
          onMouseLeave={hidePassword}>
          <FaRegEye />
        </button>
      )}
    </div>
  )
}

export default Field
