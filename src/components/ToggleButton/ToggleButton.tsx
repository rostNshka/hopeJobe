import './ToggleButton.scss'
import { useState } from 'react'
import { LuUserRound } from 'react-icons/lu'
import { IoBriefcaseOutline } from 'react-icons/io5'

type TRole = 'candidate' | 'employer'

interface IToggleButton {
  onRoleChange?: (role: TRole) => void
  defaultRole?: TRole
}

const ToggleButton = ({
  onRoleChange,
  defaultRole = 'candidate',
}: IToggleButton) => {
  const [role, setRole] = useState<TRole>(defaultRole)

  const handleRoleChange = (newRole: TRole) => {
    setRole(newRole)
    if (onRoleChange) {
      onRoleChange?.(newRole)
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
