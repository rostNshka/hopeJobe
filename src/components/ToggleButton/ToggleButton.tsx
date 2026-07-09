import './ToggleButton.scss'
import { useState } from 'react'
import { LuUserRound } from 'react-icons/lu'
import { IoBriefcaseOutline } from 'react-icons/io5'
import { TRole } from '@/types/entities/user.types'
import { ToggleButtonProps } from './ToggleButtonProps'

const ToggleButton = ({
  onRoleChange,
  defaultRole = 'USER',
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
        className={`toggle-button ${role === 'USER' ? 'active' : ''}`}
        onClick={() => handleRoleChange('USER')}>
        <LuUserRound /> Я соискатель
      </button>
      <button
        className={`toggle-button ${role === 'EMPLOYER' ? 'active' : ''}`}
        onClick={() => handleRoleChange('EMPLOYER')}>
        Я работодатель <IoBriefcaseOutline />
      </button>
    </div>
  )
}

export default ToggleButton
