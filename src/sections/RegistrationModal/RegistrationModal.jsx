import './RegistrationModal.scss'
import { useEffect, useRef, useState } from 'react'
import ToggleButton from '@/components/ToggleButton'

const RegistrationModal = (props) => {
  const { isOpen, onClose } = props
  const [userRole, setUserRole] = useState('candidate')
  const modalRef = useRef(null)

  const getNewRole = (newRole) => {
    setUserRole(newRole)
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
        <ToggleButton getNewRole={getNewRole} />
      </div>
    </div>
  )
}

export default RegistrationModal
