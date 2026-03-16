import './Header.scss'
import { NavLink } from 'react-router-dom'
import Button from '@/components/Button'
import BurgerButton from '@/components/BurgerButton'
import { useEffect, useRef, useState } from 'react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (isOpen) {
      ref.current?.show()
    } else {
      ref.current?.close()
    }
  }, [isOpen])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="header">
      <img src="/logo.svg" alt="logo" className="header__logo" />
      <dialog className="header__overlay-menu-dialog" ref={ref}>
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
      <BurgerButton
        className={`header__burger-button visible-tablet ${isOpen ? 'is-active' : ''}`}
        onClick={handleClick}
      />
    </header>
  )
}

export default Header
