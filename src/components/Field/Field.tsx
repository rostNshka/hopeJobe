import './Field.scss'
import { FaRegEye } from 'react-icons/fa6'
import { ChangeEvent, useState } from 'react'

interface IFieldProps {
  htmlFor: string
  label: string
  type?: string
  id: string
  name?: string
  placeholder?: string
  value?: string
}

interface IFieldCallbacks {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFocus?: () => void
  onBlur?: () => void
}

type TTypePassword = 'password' | 'text'

interface ITypePassword {
  defaultValue?: TTypePassword
}

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
  defaultValue = 'password',
}: IFieldProps & IFieldCallbacks & ITypePassword) => {
  const [typePassword, setTypePassword] = useState<TTypePassword>(defaultValue)

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
