import { TRole, IUserUpdateData } from '@/types/entities/user.types'

export interface RegistrationFieldProps {
  role: TRole
  onSuccess: (user: IUserUpdateData) => void
  onSwitchToLogin: () => void
}
