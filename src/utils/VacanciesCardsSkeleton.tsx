import VacancyCardSkeleton from './VacancyCardSkeleton'

const VacanciesCardsSkeleton = ({ count = 9 }: { count?: number }) => {
  return (
    <div className="vacancies__cards">
      {Array.from({ length: count }).map((_, index) => (
        <VacancyCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default VacanciesCardsSkeleton
