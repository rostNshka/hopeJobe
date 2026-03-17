import './Button.scss'

const Button = (props) => {
  const { children, color } = props
  return <button className={`button button__${color}`}>{children}</button>
}

export default Button
