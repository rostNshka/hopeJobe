import './WorkType.scss'
import { IoHomeOutline } from 'react-icons/io5'
import { MdBroadcastOnHome } from 'react-icons/md'
import { HiOutlineBuildingOffice } from 'react-icons/hi2'

const enum EWorkType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  OFFICE = 'OFFICE',
}

interface IWorkType {
  workType: EWorkType
}

const WorkType = ({ workType }: IWorkType) => {
  return (
    <div className={`work-type`}>
      {workType === EWorkType.REMOTE ? (
        <div className={`work-type__${workType}`}>
          <IoHomeOutline />
          Удаленная
        </div>
      ) : null}
      {workType === EWorkType.HYBRID ? (
        <div className={`work-type__${workType}`}>
          <MdBroadcastOnHome />
          Гибрид
        </div>
      ) : null}
      {workType === EWorkType.OFFICE ? (
        <div className={`work-type__${workType}`}>
          <HiOutlineBuildingOffice />
          Офис
        </div>
      ) : null}
    </div>
  )
}

export default WorkType
