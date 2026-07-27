import { useParams, useNavigate } from 'react-router-dom'
import { useVacancyId } from '@/adapters/router/vacancyRouter.ts'
import './VacancyDetail.scss'
import { EWorkType } from '@/types/entities/vacancy.types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const VacancyDetail = () => {
  const { detailId } = useParams()
  const navigate = useNavigate()
  const { vacancies, loading, error } = useVacancyId(detailId ?? '')

  const workTypes: Array<{ value: EWorkType; label: string }> = [
    { value: EWorkType.REMOTE, label: 'Удаленно' },
    { value: EWorkType.OFFICE, label: 'Офис' },
    { value: EWorkType.HYBRID, label: 'Гибрид' },
  ]

  const getWorkTypeLabel = (workType: EWorkType) => {
    const found = workTypes.find(type => type.value === workType)
    return found ? found.label : workType
  }

  if (loading) {
    return (
      <div className="vacancy-detail">
        <button className="vacancy-detail__back">← Назад</button>
        <div className="vacancy-detail__content">
          <Skeleton width={320} height={36} style={{ marginBlock: '32px' }} />
          <Skeleton width={180} height={20} style={{ marginBottom: '24px' }} />
          <Skeleton width={180} height={20} style={{ marginBottom: '24px' }} />
          <Skeleton width={180} height={20} style={{ marginBottom: '24px' }} />
          <Skeleton width={100} height={20} style={{ marginBottom: '24px' }} />
          <Skeleton width={320} height={20} style={{ marginBottom: '24px' }} />
          <Skeleton width={180} height={20} style={{ marginBottom: '24px' }} />
        </div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="vacancy-detail">
        <div className="vacancy-detail__error">Ошибка: {error}</div>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    )
  }

  const vacancy = Array.isArray(vacancies) ? vacancies[0] : vacancies

  if (!vacancy) {
    return (
      <div className="vacancy-detail">
        <div className="vacancy-detail__not-found">Вакансия не найдена</div>
        <button onClick={() => navigate('/')}>Вернуться к списку</button>
      </div>
    )
  }

  return (
    <div className="vacancy-detail">
      <button onClick={() => navigate(-1)} className="vacancy-detail__back">
        ← Назад
      </button>
      <div className="vacancy-detail__content">
        <h2>{vacancy.title}</h2>
        <p>Компания: {vacancy.employer?.companyName}</p>
        <p>Email: {vacancy.employer?.email}</p>
        <p>Местонахождение: {vacancy.location}</p>
        <p>Тип работы: {getWorkTypeLabel(vacancy.workType)}</p>
        <p>Описание: {vacancy.description}</p>
        <p>Зарплата: {vacancy.salary}</p>
      </div>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default VacancyDetail
