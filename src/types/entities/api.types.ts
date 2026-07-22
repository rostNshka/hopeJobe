import { IUserData, TRole } from './user.types'
import { IVacancy } from './vacancy.types'

export interface ApiResponse<T> {
  data: T | null
  token?: string
  message?: string
  error?: string
}

export type IAuthResponse = ApiResponse<IUserData>

export interface IAuthReturn<T> {
  user?: IUserData | null
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

export type IResponseResult = ApiResponse<IVacancy>

export type IResponseListResult = ApiResponse<IResponseItem[]>

export interface IResponseItem {
  id: number
  vacancy: IVacancy
}

export interface IAddResponseBody {
  vacancyId: number
}

export interface IStats {
  data: {
    employers: number
    total: number
  }
}

export interface IProfileResponse {
  data: {
    firstName?: string
    lastName?: string
    patronymic?: string
    companyName?: string
    description?: string
    user?: {
      createdAt?: string
      role?: TRole
      email?: string
    }
  }
}
export interface IVacancyResult {
  data: IVacancy[]
  message?: string
}

export interface ICheckResult {
  data: {
    isFavorite: boolean
    message?: string
  }
}
