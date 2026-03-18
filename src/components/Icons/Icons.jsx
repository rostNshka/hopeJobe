import './Icons.scss'

const Icons = (props) => {
  const { src, children } = props
  return (
    <div className="icons">
      <img src={src} alt="" width={20} height={20} />
      {children}
    </div>
  )
}

export default Icons
