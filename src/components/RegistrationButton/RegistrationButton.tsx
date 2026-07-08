import './RegistrationButton.scss'
import { RegistrationButtonProps } from './RegistrationButtonProps'

const RegistrationButton = ({
  children,
  color,
  onClick,
}: RegistrationButtonProps) => {
  return (
    <button className={`button button__${color}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default RegistrationButton
