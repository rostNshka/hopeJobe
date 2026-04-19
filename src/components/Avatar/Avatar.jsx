import './Avatar.scss'

const Avatar = (props) => {
  const { name } = props

  let result = name.match(/[A-ZА-Я]/g) || []
  if (result.length > 0) {
    result.slice(0, 2).join('')
  } else {
    result = name.trim()[0]
  }
  const colorIndex = (name.length % 5) + 1
  return (
    <div className="avatar" data-color={colorIndex}>
      {result}
    </div>
  )
}

export default Avatar
