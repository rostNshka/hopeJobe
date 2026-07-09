import './ModalSection.scss'
import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ToggleButton from '@/components/ToggleButton'
import RoleDescription from '@/components/RoleDescription'
import LoginField from '@/sections/LoginField'
import RegistrationField from '@/sections/RegistrationField'
import { useUser } from '@/context/UserContext.tsx'
import roleStore from '@/stores/role-store.tsx'
import { ModalSectionProps } from './ModalSectionProps'
import { IUserFormData, TRole } from '@/types/entities/user.types'

const ModalSection = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegistrationSuccess,
}: ModalSectionProps) => {
  const [registerModal, setRegisterModal] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const { setUser } = useUser()

  const handleRoleChange = (newRole: TRole) => {
    roleStore.role = newRole
  }

  const handleRegisterModal = () => {
    setRegisterModal(!registerModal)
  }

  const handleLoginSuccess = (user: IUserFormData) => {
    setUser(user)

    if (onLoginSuccess) {
      onLoginSuccess(user)
    }
    onClose()
  }

  const handleRegistrationSuccess = (user: IUserFormData) => {
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
        <RoleDescription role={roleStore.role} />
        {registerModal ? (
          <RegistrationField
            role={roleStore.role as TRole}
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

export default observer(ModalSection)
