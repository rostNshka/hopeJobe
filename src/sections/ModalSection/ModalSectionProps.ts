import { IUserUpdateData } from '@/types/entities/user.types'

export interface ModalSectionProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: IUserUpdateData) => void
  onRegistrationSuccess: (user: IUserUpdateData) => void
}
