import './Card.scss'
import { CiLocationOn } from 'react-icons/ci'
import Avatar from '@/components/Avatar'
import WorkType from '@/components/WorkType'
import { CiHeart } from 'react-icons/ci'
import { FaHeart } from 'react-icons/fa'
import React, { useState, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import {
  useAddResponse,
  useDeleteResponse,
} from '@/adapters/router/responseRouter'
import { userStore } from '@/stores/user-store'
import { useCheckFavorite } from '@/adapters/router/vacancyRouter.ts'
import { ICardProps } from './CardProps'
import { EWorkType } from '@/types/entities/vacancy.types'

const Card = observer(({ vacancy, onFavoriteChange }: ICardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const { addResponse } = useAddResponse()
  const { deleteResponse } = useDeleteResponse()
  const { user, token } = userStore
  const { checkFavorite } = useCheckFavorite(vacancy?.id)

  const checkStatus = useCallback(async () => {
    if (!token) {
      setIsFavorite(false)
      setIsChecking(false)
      return
    }

    try {
      const result = await checkFavorite()
      setIsFavorite(result?.isFavorite || false)
    } catch (error) {
      console.error(`Error checking favorite:, ${error}`)
    } finally {
      setIsChecking(false)
    }
  }, [checkFavorite, token])

  useEffect(() => {
    if (!token) {
      setIsFavorite(false)
      setIsChecking(false)
    } else {
      checkStatus()
    }
  }, [token])

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

    const vacancyId: number = Number(vacancy.id)

    if (wasFavorite) {
      const result = await deleteResponse(vacancyId)
      if (result?.message) {
        setIsFavorite(wasFavorite)
        alert(result.message)
      } else {
        await onFavoriteChange?.()
      }
    } else {
      const result = await addResponse(vacancyId)
      if (result?.message) {
        setIsFavorite(wasFavorite)
        alert(result.message)
      } else {
        await onFavoriteChange?.()
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
        <Avatar name={vacancy?.employer?.companyName} />
        <div className="card-header-info">
          <div className="card-header-info__company-name">
            {vacancy?.employer?.companyName}
          </div>
          <div className="card-header-info__location">
            <CiLocationOn />
            {vacancy?.location}
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
        <div className="card-body__title">{vacancy.title}</div>
        <span className="card-body__salary">{vacancy.salary}</span>
        <WorkType workType={vacancy?.workType || EWorkType.REMOTE} />
      </div>
    </div>
  )
})

export default Card
