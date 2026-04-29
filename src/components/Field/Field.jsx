import './Field.scss'
import { FaRegEye } from 'react-icons/fa6'
import { useState } from 'react'

const Field = (props) => {
  const { htmlFor, label, type, id, name, placeholder } = props
  const [typePassword, setTypePassword] = useState('password')

  const showPassword = () => {
    setTypePassword('text')
  }

  const hidePassword = () => {
    setTypePassword('password')
  }

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
          placeholder={placeholder}></textarea>
      ) : (
        <input
          type={type === 'password' ? typePassword : type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="field__input"
        />
      )}
      {id === 'password' && (
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
