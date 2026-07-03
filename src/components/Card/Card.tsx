import './Card.scss'
import { CiLocationOn } from 'react-icons/ci'
import Avatar from '@/components/Avatar'
import WorkType from '@/components/WorkType'
import { CiHeart } from 'react-icons/ci'
import { FaHeart } from 'react-icons/fa'
import React, { useState, useEffect, useCallback } from 'react'
import {
  useAddResponse,
  useDeleteResponse,
} from '@/adapters/router/responseRouter'
import { useUser } from '@/context/UserContext'
import { useCheckFavorite } from '@/adapters/router/vacancyRouter'
import { EWorkType } from '@/components/WorkType/WorkType.tsx'

interface IEmployer {
  companyName: string
}

interface IUser {
  id: number
  title: string
  salary: string
  location: string
  workType: EWorkType
  employer: IEmployer
}

export interface ICardProps {
  vacancies: IUser
  onFavoriteChange?: () => void | Promise<void>
}

const Card = ({ vacancies }: ICardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const { addResponse } = useAddResponse()
  const { deleteResponse } = useDeleteResponse()
  const { user, token } = useUser()
  const { checkFavorite } = useCheckFavorite(vacancies.id)

  const checkStatus = useCallback(async () => {
    if (!token) {
      setIsFavorite(false)
      setIsChecking(false)
      return
    }

    try {
      const result = await checkFavorite()
      setIsFavorite(result.isFavorite)
    } catch (error) {
      alert(`Error: ${error}`)
    } finally {
      setIsChecking(false)
    }
  }, [checkFavorite, token])

  useEffect(() => {
    checkStatus()
  }, [checkStatus, user])

  useEffect(() => {
    const handleStorageChange = () => {
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
  }, [checkStatus, token])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(true)

    const wasFavorite: boolean = isFavorite
    setIsFavorite(!wasFavorite)

    const vacancyId: number = Number(vacancies.id)

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
        <Avatar name={vacancies?.employer?.companyName} />
        <div className="card-header-info">
          <div className="card-header-info__company-name">
            {vacancies?.employer?.companyName}
          </div>
          <div className="card-header-info__location">
            <CiLocationOn />
            {vacancies?.location}
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
