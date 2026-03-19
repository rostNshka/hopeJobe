import './VacanciesTitle.scss'

const VacanciesTitle = () => {
  return (
    <div className="vacancies-title">
      <h1 className="vacancies-title__header">
        Найдите работу<span> мечты </span>
      </h1>
      <p className="vacancies-title__info">
        Тысячи вакансий от ведущих компаний России. <br /> Найдите позицию,
        которая соответствует вашим навыкам и амбициям.
      </p>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default VacanciesTitle
