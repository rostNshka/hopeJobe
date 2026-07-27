import VacanciesTitle from '@/sections/VacanciesTitle'
import { useVacancy } from '@/adapters/router/vacancyRouter.js'
import './Vacancies.scss'
import Cards from '@/sections/Cards'
import VacanciesInput from '@/sections/VacanciesInput'
import { useMemo, useState, useRef, useEffect } from 'react'
import VacanciesStatistics from '@/sections/VacanciesStatistics'
import { IVacancy } from '@/types/entities/vacancy.types'
import ReactPaginate from 'react-paginate'

const Vacancies = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const searchQuery = debouncedSearchTerm.trim() || undefined

  const { vacancies, pagination, loading, error } = useVacancy(
    searchQuery,
    currentPage
  )

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 300)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [searchTerm])

  const filteredVacancies = useMemo((): IVacancy[] => {
    if (!vacancies) {
      return []
    }
    return vacancies
  }, [vacancies])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="vacancies">
      <VacanciesTitle />
      <VacanciesInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <VacanciesStatistics />

      {loading && <p className="vacancies__loading">Загрузка вакансий</p>}

      {error && (
        <p className="vacancies__error">
          К сожалению, произошла ошибка: {error} :(
        </p>
      )}

      {!loading && !error && (
        <>
          {filteredVacancies.length === 0 ? (
            <p className="vacancies__empty">
              По вашему запросу ничего не найдено
            </p>
          ) : (
            <>
              <Cards vacancies={filteredVacancies} />

              {pagination && pagination.totalPages > 1 && (
                <ReactPaginate
                  pageCount={pagination.totalPages}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageChange}
                  forcePage={currentPage - 1}
                  containerClassName="pagination"
                  pageClassName="pagination__item"
                  pageLinkClassName="pagination__link"
                  activeClassName="pagination__item--active"
                  activeLinkClassName="pagination__link--active"
                  previousClassName="pagination__previous"
                  nextClassName="pagination__next"
                  previousLinkClassName="pagination__link"
                  nextLinkClassName="pagination__link"
                  disabledClassName="pagination__item--disabled"
                  breakClassName="pagination__break"
                  breakLinkClassName="pagination__link"
                  previousLabel="Назад"
                  nextLabel="Вперед"
                  breakLabel="..."
                  renderOnZeroPageCount={null}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Vacancies
