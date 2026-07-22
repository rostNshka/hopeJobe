import './Header.scss'
import { NavLink } from 'react-router-dom'
import RegistrationButton from '@/components/RegistrationButton'
import BurgerButton from '@/components/BurgerButton'
import { useEffect, useRef, useState } from 'react'
import { CiStar, CiBookmarkPlus } from 'react-icons/ci'
import ModalSection from '@/sections/ModalSection/ModalSection'
import ProfileButton from '@/components/ProfileButton'
import ProfileModal from '@/sections/ProfileModal'
import { observer } from 'mobx-react-lite'
import { userStore } from '@/stores/user-store'
import toastStore from '@/stores/toast-store'
import ToggleTheme from '@/components/ToggleTheme'

const Header = observer(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isProfileModal, setIsProfileModal] = useState<boolean>(false)
  const ref = useRef<HTMLDialogElement>(null)

  const { user, logout, isAuthenticated } = userStore

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

  const handleLoginSuccess = () => {
    setIsModalOpen(false)
    toastStore.showSuccess(`Добро пожаловать!`)
  }

  const handleRegistrationSuccess = () => {
    toastStore.showSuccess(
      `Регистрация успешно завершена! Теперь вы можете войти`
    )
  }

  const handleLogout = () => {
    logout()
    setIsProfileModal(false)
  }

  return (
    <header className="header">
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
          <div className="header__toolbar">
            <ToggleTheme />
            <RegistrationButton
              color="violet"
              onClick={() => setIsModalOpen(true)}>
              Войти
            </RegistrationButton>
          </div>
        ) : (
          <div className="header__toolbar">
            <ToggleTheme />
            <ProfileButton onClick={() => setIsProfileModal(true)}>
              {user?.lastName || user?.companyName} {user?.firstName || null}
            </ProfileButton>
          </div>
        )}
      </dialog>
      <BurgerButton
        className={`header__burger-button visible-tablet ${isOpen ? 'is-active' : ''}`}
        onClick={handleClick}
      />
      <ProfileModal
        isOpen={isProfileModal}
        onClose={() => setIsProfileModal(false)}
        userId={user?.id}
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
})

export default Header
