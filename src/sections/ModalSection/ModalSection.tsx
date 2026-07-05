import './ModalSection.scss'
import React, { useEffect, useRef, useState } from 'react'
import ToggleButton from '@/components/ToggleButton'
import RoleDescription from '@/components/RoleDescription'
import LoginField from '@/sections/LoginField'
import RegistrationField from '@/sections/RegistrationField'
import { useUser } from '@/context/UserContext.tsx'
import { TTypeRole } from '@/sections/RegistrationField/RegistrationField.tsx'
import { IUser } from '@/sections/LoginField/LoginField.tsx'

interface IModalSectionProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: IUser) => void
  onRegistrationSuccess: (user: IUser) => void
}

const ModalSection = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegistrationSuccess,
}: IModalSectionProps) => {
  const [registerModal, setRegisterModal] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<TTypeRole>('candidate')
  const modalRef = useRef<HTMLDivElement>(null)

  const { setUser } = useUser()

  const handleRoleChange = (newRole: TTypeRole) => {
    setUserRole(newRole)
  }

  const handleRegisterModal = () => {
    setRegisterModal(!registerModal)
  }

  const handleLoginSuccess = (user: IUser) => {
    setUser(user)

    if (onLoginSuccess) {
      onLoginSuccess(user)
    }
    onClose()
  }

  const handleRegistrationSuccess = (user: IUser) => {
    if (onRegistrationSuccess) {
      onRegistrationSuccess(user)
    }
    setRegisterModal(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <h3 className="modal-content__title">Вход в аккаунт</h3>
        <p>Выберите тип учётной записи</p>
        <ToggleButton onRoleChange={handleRoleChange} />
        <RoleDescription role={userRole} />
        {registerModal ? (
          <RegistrationField
            role={userRole}
            onSuccess={handleRegistrationSuccess}
            onSwitchToLogin={() => setRegisterModal(false)}
          />
        ) : (
          <LoginField onSuccess={handleLoginSuccess} />
        )}
        <div
          className="modal-content__registration"
          onClick={handleRegisterModal}>
          {!registerModal ? (
            <div>
              Нет аккаунта? <span>Зарегистрируйтесь</span>
            </div>
          ) : (
            <div>
              Есть аккаунт? <span>Войдите</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalSection
