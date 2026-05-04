import './ProfileButton.scss'

const ProfileButton = ({ children, onClick }) => {
  return (
    <button className="profile-button" onClick={onClick}>
      {children}
    </button>
  )
}

export default ProfileButton
