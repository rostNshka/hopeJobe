import { IUserUpdateData } from '@/types/entities/user.types'

export interface ILoginFieldProps {
  onSuccess: (user: IUserUpdateData) => void
}
