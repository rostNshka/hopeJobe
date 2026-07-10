import { TRole, IUserData } from '@/types/entities/user.types'

export interface RegistrationFieldProps {
  role: TRole
  onSuccess: (user: IUserData) => void
  onSwitchToLogin: () => void
}
