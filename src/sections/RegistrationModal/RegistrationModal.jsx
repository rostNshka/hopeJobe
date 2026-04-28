import './RegistrationModal.scss'
import { useEffect, useRef, useState } from 'react'
import ToggleButton from '@/components/ToggleButton'
import RoleDescription from '@/components/RoleDescription'
import LoginField from '@/sections/LoginField'
import RegistrationField from '@/sections/RegistrationField'

const RegistrationModal = (props) => {
  const { isOpen, onClose } = props
  const [registerModal, setRegisterModal] = useState(false)
  const [userRole, setUserRole] = useState('candidate')
  const modalRef = useRef(null)

  const handleRoleChange = (newRole) => {
    setUserRole(newRole)
  }

  const handleRegisterModal = () => {
    setRegisterModal(!registerModal)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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
    const handleEscape = (event) => {
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

  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <h3 className="modal-content__title">Вход в аккаунт</h3>
        <p>Выберите тип учётной записи</p>
        <ToggleButton onRoleChange={handleRoleChange} />
        <RoleDescription role={userRole} />
        {registerModal ? (
          <RegistrationField role={userRole} />
        ) : (
          <LoginField role={userRole} />
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

export default RegistrationModal
