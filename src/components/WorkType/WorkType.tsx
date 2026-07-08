import './WorkType.scss'
import { IoHomeOutline } from 'react-icons/io5'
import { MdBroadcastOnHome } from 'react-icons/md'
import { HiOutlineBuildingOffice } from 'react-icons/hi2'
import { EWorkType } from '@/types/entities/global'
import { WorkTypeProps } from './WorkTypeProps'

const workTypeConfig = {
  [EWorkType.REMOTE]: {
    icon: IoHomeOutline,
    label: 'Удаленная',
  },
  [EWorkType.HYBRID]: {
    icon: MdBroadcastOnHome,
    label: 'Гибрид',
  },
  [EWorkType.OFFICE]: {
    icon: HiOutlineBuildingOffice,
    label: 'Офис',
  },
}

const WorkType = ({ workType }: WorkTypeProps) => {
  const config = workTypeConfig[workType]
  if (!config) {
    return null
  }

  const IconComponent = config.icon

  return (
    <div className={`work-type`}>
      <div className={`work-type__${workType}`}>
        <IconComponent />
        {config.label}
      </div>
    </div>
  )
}

export default WorkType
