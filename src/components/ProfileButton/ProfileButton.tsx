import './ProfileButton.scss'
import React from 'react'

interface IBurgerButton {
  children?: React.ReactNode
  onClick?: () => void
}

const ProfileButton = ({ children, onClick }: IBurgerButton) => {
  return (
    <button className="profile-button" onClick={onClick}>
      {children}
    </button>
  )
}

export default ProfileButton
