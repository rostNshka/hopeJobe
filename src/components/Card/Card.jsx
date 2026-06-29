import './Card.scss'
import { CiLocationOn } from 'react-icons/ci'
import Avatar from '@/components/Avatar'
import WorkType from '@/components/WorkType'
import { CiHeart } from 'react-icons/ci'
import { FaHeart } from 'react-icons/fa'
import { useState, useEffect, useCallback } from 'react'
import {
  useAddResponse,
  useDeleteResponse,
} from '@/adapters/router/responseRouter'
import { useUser } from '@/context/UserContext'

const Card = (props) => {
  const { vacancies } = props
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const { addResponse } = useAddResponse()
  const { deleteResponse } = useDeleteResponse()
  const { user } = useUser()

  const checkStatus = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsFavorite(false)
      setIsChecking(false)
      return
    }

    try {
      const response = await fetch(`/api/responses/check/${vacancies.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await response.json()
      setIsFavorite(result.data?.isFavorite || false)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsChecking(false)
    }
  }, [vacancies.id])

  useEffect(() => {
    checkStatus()
  }, [checkStatus, user])

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsFavorite(false)
        setIsChecking(false)
      } else {
        checkStatus()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleStorageChange)
    }
  }, [checkStatus])

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(true)

    const wasFavorite = isFavorite
    setIsFavorite(!wasFavorite)

    const vacancyId = Number(vacancies.id)

    if (wasFavorite) {
      const result = await deleteResponse(vacancyId)
      if (!result) {
        setIsFavorite(wasFavorite)
        alert(result.message)
      }
    } else {
      const result = await addResponse(vacancyId)
      if (!result) {
        setIsFavorite(wasFavorite)
        alert(result.message)
      }
    }

    setIsLoading(false)
  }

  if (isChecking) {
    return <div className="card-loading">Загрузка...</div>
  }

  return (
    <div className="card">
      <div className="card-header">
        <Avatar name={vacancies.employer?.companyName} />
        <div className="card-header-info">
          <div className="card-header-info__company-name">
            {vacancies.employer?.companyName}
          </div>
          <div className="card-header-info__location">
            <CiLocationOn />
            {vacancies.location}
          </div>
        </div>

        <button
          className="card-header__favorite-btn"
          onClick={handleFavoriteClick}
          disabled={isLoading}>
          {isFavorite ? (
            <FaHeart className="card-header__heart active" />
          ) : (
            <CiHeart className="card-header__heart" />
          )}
        </button>
      </div>
      <div className="card-body">
        <div className="card-body__title">{vacancies.title}</div>
        <span className="card-body__salary">{vacancies.salary}</span>
        <WorkType workType={vacancies.workType} />
      </div>
    </div>
  )
}

export default Card
