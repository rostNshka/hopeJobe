import './Header.scss'
import { NavLink } from 'react-router-dom'
import RegistrationButton from '@/components/RegistrationButton'
import BurgerButton from '@/components/BurgerButton'
import { useEffect, useRef, useState } from 'react'
import { CiStar, CiBookmarkPlus } from 'react-icons/ci'
import ModalSection from '@/sections/ModalSection/ModalSection'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
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

  const handleLoginSuccess = (user) => {
    setIsModalOpen(false)
    setToastMessage(`Добро пожаловать, ${user?.profile?.firstName}!`)

    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleRegistrationSuccess = () => {
    setToastMessage(`Регистрация успешно завершена! Теперь вы можете войти.`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <header className="header">
      {toastMessage && <div className="toast-message">{toastMessage}</div>}

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
      <ModalSection
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </header>
  )
}

export default Header
