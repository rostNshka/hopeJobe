import './ToggleButton.scss'
import { useState } from 'react'
import { LuUserRound } from 'react-icons/lu'
import { IoBriefcaseOutline } from 'react-icons/io5'
import { TRole } from '@/types/entities/global'
import { ToggleButtonProps } from './ToggleButtonProps'

const ToggleButton = ({
  onRoleChange,
  defaultRole = 'candidate',
}: ToggleButtonProps) => {
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
