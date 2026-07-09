export type TRole = 'USER' | 'EMPLOYER'

export interface IUserAssets {
  email: string
  password: string
}

export interface IUserName extends IUserAssets {
  firstName: string
  lastName: string
  patronymic: string
}

export interface IEmployerName extends IUserAssets {
  companyName: string
  description: string
}

export interface IUserFormData {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  patronymic?: string
  companyName?: string
  description?: string
  role?: TRole
}

export interface IUserUpdateData {
  id?: number
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  patronymic?: string
  companyName?: string
  description?: string
  role?: TRole
}
