import './Header.scss'
import { NavLink } from 'react-router-dom'
import Button from '@/components/Button'
import BurgerButton from '@/components/BurgerButton'

const Header = () => {
  return (
    <header className="header">
      <img src="/logo.svg" alt="logo" className="header__logo" />
      <dialog className="header__overlay-menu-dialog" open>
        <nav className="header__nav">
          <NavLink to={'/'} className="header__nav-item">
            Вакансии
          </NavLink>
          <NavLink to={'/favorites'} className="header__nav-item">
            Избранное
          </NavLink>
          <NavLink to={'/add-vacancy'} className="header__nav-item">
            Новая вакансия
          </NavLink>
          <span></span>
        </nav>
        <Button color="violet">Войти</Button>
      </dialog>
      <BurgerButton className="header__burger-button visible-tablet" />
    </header>
  )
}

export default Header
