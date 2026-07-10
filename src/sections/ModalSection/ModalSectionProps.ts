import { IUserContextData, IUserData } from '@/types/entities/user.types'

export interface ModalSectionProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: IUserContextData) => void
  onRegistrationSuccess: (user: IUserData) => void
}
