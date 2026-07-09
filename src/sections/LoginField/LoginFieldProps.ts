import { IUserFormData } from '@/types/entities/user.types'

export interface ILoginFieldProps {
  onSuccess: (user: IUserFormData) => void
}
