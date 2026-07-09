import { TRole, IUserFormData } from '@/types/entities/user.types'

export interface RegistrationFieldProps {
  role: TRole
  onSuccess: (user: IUserFormData) => void
  onSwitchToLogin: () => void
}
