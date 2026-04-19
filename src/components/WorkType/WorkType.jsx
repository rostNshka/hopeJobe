import './WorkType.scss'
import { IoHomeOutline } from 'react-icons/io5'
import { MdBroadcastOnHome } from 'react-icons/md'
import { HiOutlineBuildingOffice } from 'react-icons/hi2'

const WorkType = (props) => {
  const { workType } = props
  return (
    <div className={`work-type`}>
      {workType === 'REMOTE' ? (
        <div className={`work-type__${workType}`}>
          <IoHomeOutline />
          Удаленная
        </div>
      ) : null}
      {workType === 'HYBRID' ? (
        <div className={`work-type__${workType}`}>
          <MdBroadcastOnHome />
          Гибрид
        </div>
      ) : null}
      {workType === 'OFFICE' ? (
        <div className={`work-type__${workType}`}>
          <HiOutlineBuildingOffice />
          Офис
        </div>
      ) : null}
    </div>
  )
}

export default WorkType
