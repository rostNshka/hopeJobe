export type TRole = 'USER' | 'EMPLOYER'

export interface IUser {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  patronymic: string
  companyName: string
  description: string
  role: TRole
}

export type IUserAssets = Pick<IUser, 'email' | 'password'>

export interface IUserName extends IUserAssets {
  firstName: string
  lastName: string
  patronymic: string
}

export interface IEmployerName extends IUserAssets {
  companyName: string
  description: string
}

export type IRegisterData = Omit<IUser, 'id'>

export type IRegisterFormData = Partial<
  Omit<IUser, 'id' | 'email' | 'password'>
> &
  Pick<IUser, 'email' | 'password'>

export type IUserData = Partial<Omit<IUser, 'id' | 'email' | 'password'>> & {
  role?: TRole
}

export type IUserContextData = Pick<IUser, 'id' | 'email' | 'role'> &
  Partial<Omit<IUser, 'id' | 'email' | 'role'>> & {
    password?: string
  }
