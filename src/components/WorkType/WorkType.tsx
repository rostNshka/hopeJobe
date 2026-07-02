import './WorkType.scss'
import { IoHomeOutline } from 'react-icons/io5'
import { MdBroadcastOnHome } from 'react-icons/md'
import { HiOutlineBuildingOffice } from 'react-icons/hi2'

export const enum EWorkType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  OFFICE = 'OFFICE',
}

interface IWorkTypeProps {
  workType: EWorkType
}

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

const WorkType = ({ workType }: IWorkTypeProps) => {
  const config = workTypeConfig[workType]
  if (!config) return null

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
