import VacanciesTitle from '@/sections/VacanciesTitle'
import { useVacancy } from '@/adapters/router/vacancyRouter.js'
import './Vacancies.scss'
import Cards from '@/sections/Cards'
import VacanciesInput from '@/sections/VacanciesInput'
import { useState, useRef, useEffect, useCallback } from 'react'
import VacanciesStatistics from '@/sections/VacanciesStatistics'
import { IVacancy } from '@/types/entities/vacancy.types'
import InfiniteScroll from 'react-infinite-scroll-component'

const Vacancies = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')
  const [allVacancies, setAllVacancies] = useState<IVacancy[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const searchQuery = debouncedSearchTerm.trim() || undefined

  const { vacancies, pagination, loading, error } = useVacancy(
    searchQuery,
    currentPage
  )

  useEffect(() => {
    if (vacancies && vacancies.length > 0) {
      setAllVacancies(prev => {
        if (currentPage === 1) {
          return vacancies
        }
        const existingIds = new Set(prev.map(v => v.id))
        const newVacancies = vacancies.filter(v => !existingIds.has(v.id))
        return [...prev, ...newVacancies]
      })
      setIsInitialLoad(false)
    } else if (!loading && currentPage === 1) {
      setAllVacancies([])
      setIsInitialLoad(false)
    }
  }, [vacancies, currentPage, loading])

  useEffect(() => {
    if (pagination) {
      setHasMore(currentPage < pagination.totalPages)
    }
  }, [pagination, currentPage])

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      if (searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm)
        setCurrentPage(1)
        setAllVacancies([])
        setIsInitialLoad(true)
        setHasMore(true)
      }
    }, 300)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [searchTerm])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [loading, hasMore])

  useEffect(() => {
    if (error) {
      setAllVacancies([])
      setIsInitialLoad(false)
    }
  }, [error])

  if (isInitialLoad && loading) {
    return (
      <div className="vacancies">
        <VacanciesTitle />
        <VacanciesInput
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <VacanciesStatistics />
        <p className="vacancies__loading">Загрузка вакансий...</p>
      </div>
    )
  }

  return (
    <div className="vacancies">
      <VacanciesTitle />
      <VacanciesInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <VacanciesStatistics />

      {error && (
        <p className="vacancies__error">
          К сожалению, произошла ошибка: {error} :(
        </p>
      )}

      {!error && !isInitialLoad && allVacancies.length === 0 && (
        <p className="vacancies__empty">По вашему запросу ничего не найдено</p>
      )}

      {!error && allVacancies.length > 0 && (
        <InfiniteScroll
          dataLength={allVacancies.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="vacancies__loading-more">
              <p>Загрузка еще...</p>
            </div>
          }
          scrollThreshold={0.9}
          pullDownToRefresh={false}>
          <Cards vacancies={allVacancies} />
        </InfiniteScroll>
      )}
    </div>
  )
}

export default Vacancies
