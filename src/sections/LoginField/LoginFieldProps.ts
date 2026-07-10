import { IUserContextData } from '@/types/entities/user.types'

export interface ILoginFieldProps {
  onSuccess: (user: IUserContextData) => void
}
