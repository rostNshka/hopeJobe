import './VacanciesInput.scss'
import { IoSearchOutline } from 'react-icons/io5'

const VacanciesInput = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="vacancies-input">
      <IoSearchOutline className="vacancies-input__icon" />
      <input
        type="text"
        placeholder="Должность, компания, технология или город..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}

export default VacanciesInput
