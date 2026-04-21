import './Header.scss'
import { NavLink } from 'react-router-dom'
import RegistrationButton from '@/components/RegistrationButton'
import BurgerButton from '@/components/BurgerButton'
import { useEffect, useRef, useState } from 'react'
import { CiStar, CiBookmarkPlus } from 'react-icons/ci'
import RegistrationModal from '@/sections/RegistrationModal'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
            <CiStar />
            Избранное
          </NavLink>
          <NavLink to={'/add-vacancy'} className="header__nav-item">
            <CiBookmarkPlus />
            Новая вакансия
          </NavLink>
          <span></span>
        </nav>
        <RegistrationButton color="violet" onClick={() => setIsModalOpen(true)}>
          Войти
        </RegistrationButton>
      </dialog>
      <BurgerButton
        className={`header__burger-button visible-tablet ${isOpen ? 'is-active' : ''}`}
        onClick={handleClick}
      />
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  )
}

export default Header
