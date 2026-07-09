import { TRole } from '@/types/entities/user.types'

export interface ToggleButtonProps {
  onRoleChange?: (role: TRole) => void
  defaultRole?: TRole
}
