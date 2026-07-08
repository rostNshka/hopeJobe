import './Avatar.scss'
import { AvatarProps } from './AvatarProps'

const Avatar = ({ name }: AvatarProps) => {
  const matches = name.match(/[A-ZА-Я]/g) || []
  let initials: string
  if (matches.length > 0) {
    initials = matches.slice(0, 2).join('')
  } else {
    initials = name.trim()[0] || '?'
  }
  const colorIndex = (name.length % 5) + 1
  return (
    <div className="avatar" data-color={colorIndex}>
      {initials}
    </div>
  )
}

export default Avatar
