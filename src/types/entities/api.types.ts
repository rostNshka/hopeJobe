import { IUserFormData, TRole } from './user.types'
import { IVacancyInfo } from './vacancy.types'

export interface ApiResponse<T> {
  data: T | null
  token?: string
  message?: string
}

export type IAuthResponse = ApiResponse<IUserFormData>

export interface IAuthReturn<T> {
  user?: IUserFormData | null
  token?: string
  loading: boolean
  error: string | null
  execute: (data: T) => Promise<IAuthResponse>
}

export interface ILoginResponse {
  message: string
  token: string
  user: {
    id: number
    email: string
    role: TRole
    profile?: {
      firstName?: string
      lastName?: string
      patronymic?: string
      companyName?: string
      description?: string
    }
  }
}

export interface IRegisterResponse {
  message?: string
  data: {
    firstName?: string
    lastName?: string
    patronymic?: string
    companyName?: string
    description?: string
    role?: TRole
  }
}

export type IResponseResult = ApiResponse<IVacancyInfo>

export type IResponseListResult = ApiResponse<IResponseItem[]>

export interface IResponseItem {
  id: number
  vacancy: IVacancyInfo
}

export interface IAddResponseBody {
  vacancyId: number
}
