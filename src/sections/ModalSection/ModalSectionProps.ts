import { IUserFormData } from '@/types/entities/user.types'

export interface ModalSectionProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: IUserFormData) => void
  onRegistrationSuccess: (user: IUserFormData) => void
}
