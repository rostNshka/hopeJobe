export interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  userId?: number
}
