import './ToggleButton.scss'
import { useState } from 'react'
import { LuUserRound } from 'react-icons/lu'
import { IoBriefcaseOutline } from 'react-icons/io5'

const ToggleButton = (props) => {
  const { onRoleChange } = props
  const [role, setRole] = useState('candidate')

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (onRoleChange) {
      onRoleChange(newRole)
    }
  }

  return (
    <div className="toggle-buttons">
      <button
        className={`toggle-button ${role === 'candidate' ? 'active' : ''}`}
        onClick={() => handleRoleChange('candidate')}>
        <LuUserRound /> Я соискатель
      </button>
      <button
        className={`toggle-button ${role === 'employer' ? 'active' : ''}`}
        onClick={() => handleRoleChange('employer')}>
        Я работодатель <IoBriefcaseOutline />
      </button>
    </div>
  )
}

export default ToggleButton
