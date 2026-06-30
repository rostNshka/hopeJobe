import './RoleDescription.scss'
import { PiMagicWandThin } from 'react-icons/pi'

interface IRoleDescription {
  role?: string
}

const RoleDescription = ({ role }: IRoleDescription) => {
  return (
    <div className={`role-description__${role}`}>
      <PiMagicWandThin className="icon" />
      {role === 'employer' ? (
        <p className={`role-description__${role}-info`}>
          Размещайте вакансии и управляйте откликами в личном кабинете.
        </p>
      ) : (
        <p className={`role-description__${role}-info`}>
          Ищите работу и сохраняйте понравившиеся вакансии.
        </p>
      )}
    </div>
  )
}

export default RoleDescription
