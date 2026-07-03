import './NotFound.scss'
import NotFoundImg from '@/assets/images/detective-check.png'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

const NotFound = () => {
  const navigate = useNavigate()

  const handleNavigate = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <div className="not-found">
      <h2>Страница не найдена :c </h2>
      <img src={NotFoundImg} alt="" />
      <p>Извините, запрашиваемая страница не существует или была перемещена.</p>
      <button type="button" onClick={handleNavigate}>
        На главную
      </button>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default NotFound
