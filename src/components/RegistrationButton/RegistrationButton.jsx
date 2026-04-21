import './RegistrationButton.scss'

const RegistrationButton = (props) => {
  const { children, color, onClick } = props
  return (
    <button className={`button button__${color}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default RegistrationButton
