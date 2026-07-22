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
import toastStore from '@/stores/toast-store'

const Card = observer(({ vacancy, onFavoriteChange }: ICardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const { addResponse } = useAddResponse()
  const { deleteResponse } = useDeleteResponse()
  const { user, token } = userStore
  const { checkFavorite } = useCheckFavorite(vacancy?.id)

  const checkStatus = useCallback(async () => {
    if (!token || !user) {
      setIsFavorite(false)
      setIsChecking(false)
      return
    }

    try {
      const result = await checkFavorite()
      setIsFavorite(result?.isFavorite || false)
    } catch (error) {
      console.error(`Error checking favorite:, ${error}`)
      setIsFavorite(false)
    } finally {
      setIsChecking(false)
    }
  }, [checkFavorite, token, user])

  useEffect(() => {
    if (token && user) {
      checkStatus()
    } else {
      setIsFavorite(false)
      setIsChecking(false)
      setIsLoading(false)
    }
  }, [token, user, checkStatus])

  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = userStore.token
      const currentUser = userStore.user

      if (currentToken && currentUser) {
        checkStatus()
      } else {
        setIsFavorite(false)
        setIsChecking(false)
        setIsLoading(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleStorageChange)
    }
  }, [checkStatus])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(true)

    const wasFavorite: boolean = isFavorite
    const vacancyId: number = Number(vacancy.id)

    try {
      if (wasFavorite) {
        const result = await deleteResponse(vacancyId)

        if (result.error) {
          toastStore.showInfo(
            result.message || 'Ошибка при удалении из избранного'
          )
          setIsFavorite(true)
        } else {
          toastStore.showInfo(result.message || 'Удалено из избранного')
          setIsFavorite(false)
          await onFavoriteChange?.()
        }
      } else {
        const result = await addResponse(vacancyId)

        if (result.error) {
          toastStore.showInfo('Ошибка при добавлении в избранное')
          setIsFavorite(false)
        } else {
          toastStore.showInfo('Добавлено в избранное')
          setIsFavorite(true)
          await onFavoriteChange?.()
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toastStore.showInfo('Произошла ошибка. Попробуйте позже.')
      await checkStatus()
    } finally {
      setIsLoading(false)
    }
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
