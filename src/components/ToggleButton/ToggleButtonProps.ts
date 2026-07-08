import { TRole } from '@/types/entities/global'

export interface ToggleButtonProps {
  onRoleChange?: (role: TRole) => void
  defaultRole?: TRole
}
