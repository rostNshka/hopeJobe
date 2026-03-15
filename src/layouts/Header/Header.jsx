import './Header.scss'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <NavLink to={'/'}>Вакансии</NavLink>
      <NavLink to={'/favorites'}>Избранное</NavLink>
      <NavLink to={'/add-vacancy'}>Добавить вакансию</NavLink>
    </>
  )
}

export default Header
