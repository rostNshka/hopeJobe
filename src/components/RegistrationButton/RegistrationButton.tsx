import './RegistrationButton.scss'
import React from 'react'

interface IRegistrationButton {
  children?: React.ReactNode
  color?: string
  onClick?: () => void
}

const RegistrationButton = ({
  children,
  color,
  onClick,
}: IRegistrationButton) => {
  return (
    <button className={`button button__${color}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default RegistrationButton
