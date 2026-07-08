import './ProfileButton.scss'
import { ProfileButtonProps } from './ProfileButtonProps'

const ProfileButton = ({ children, onClick }: ProfileButtonProps) => {
  return (
    <button className="profile-button" onClick={onClick}>
      {children}
    </button>
  )
}

export default ProfileButton
