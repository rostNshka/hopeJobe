import './Header.scss'
import { NavLink } from 'react-router-dom'
import RegistrationButton from '@/components/RegistrationButton'
import BurgerButton from '@/components/BurgerButton'
import { useEffect, useRef, useState } from 'react'
import { CiStar, CiBookmarkPlus } from 'react-icons/ci'
import ModalSection from '@/sections/ModalSection/ModalSection'
import ProfileButton from '@/components/ProfileButton'
import ProfileModal from '@/sections/ProfileModal'
import { useUser } from '@/context/UserContext.tsx'
import { IUser } from '@/sections/LoginField/LoginField.tsx'

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isProfileModal, setIsProfileModal] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>('')
  const ref = useRef<HTMLDialogElement>(null)

  const { user, logout, isAuthenticated } = useUser()

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

  const handleLoginSuccess = (user: IUser) => {
    setIsModalOpen(false)
    setToastMessage(
      `Добро пожаловать, ${user?.profile?.firstName || user?.profile?.companyName}!`,
    )

    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleRegistrationSuccess = () => {
    setToastMessage(`Регистрация успешно завершена! Теперь вы можете войти.`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleLogout = () => {
    logout()
    setIsProfileModal(false)
  }

  return (
    <header className="header">
      {toastMessage && <div className="toast-message">{toastMessage}</div>}

      <img src="/logo.svg" alt="logo" className="header__logo" />
      <dialog className="header__overlay-menu-dialog" ref={ref}>
        {isAuthenticated && (
          <nav className="header__nav">
            <NavLink to={'/'} className="header__nav-item">
              Вакансии
            </NavLink>
            {user?.role === 'USER' ? (
              <NavLink to={'/favorites'} className="header__nav-item">
                <CiStar />
                Избранное
              </NavLink>
            ) : (
              <NavLink to={'/my-vacancy'} className="header__nav-item">
                <CiStar />
                Мои вакансии
              </NavLink>
            )}
            <NavLink to={'/add-vacancy'} className="header__nav-item">
              <CiBookmarkPlus />
              Новая вакансия
            </NavLink>
            <span></span>
          </nav>
        )}
        {!user ? (
          <RegistrationButton
            color="violet"
            onClick={() => setIsModalOpen(true)}>
            Войти
          </RegistrationButton>
        ) : (
          <ProfileButton onClick={() => setIsProfileModal(true)}>
            {user?.profile?.lastName || user?.profile?.companyName}{' '}
            {user?.profile?.firstName || null}
          </ProfileButton>
        )}
      </dialog>
      <BurgerButton
        className={`header__burger-button visible-tablet ${isOpen ? 'is-active' : ''}`}
        onClick={handleClick}
      />
      <ProfileModal
        isOpen={isProfileModal}
        onClose={() => setIsProfileModal(false)}
        userId={user?.profile?.userId}
        onLogout={handleLogout}
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
