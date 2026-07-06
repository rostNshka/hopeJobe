import './VacanciesInput.scss'
import { IoSearchOutline } from 'react-icons/io5'

interface IVacanciesInputProps {
  searchTerm: string
  onSearchChange: (searchTerm: string) => void
}

const VacanciesInput = ({
  searchTerm,
  onSearchChange,
}: IVacanciesInputProps) => {
  return (
    <div className="vacancies-input">
      <IoSearchOutline className="vacancies-input__icon" />
      <input
        type="text"
        placeholder="Должность, компания, технология или город..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}

export default VacanciesInput
