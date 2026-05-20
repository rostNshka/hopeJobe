import './NotFound.scss'
import NotFoundImg from '@/assets/images/detective-check.png'

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>Страницы не найдена :c </h2>
      <img src={NotFoundImg} alt="" />
      <p>Извините, запрашиваемая страница не существует или была перемещена.</p>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
    </div>
  )
}

export default NotFound
