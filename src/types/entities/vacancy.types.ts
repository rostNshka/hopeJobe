export enum EWorkType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  OFFICE = 'OFFICE',
}

export interface IVacancyData {
  id?: number
  title: string
  salary: string
  location: string
  workType: EWorkType | ''
  description?: string
}

export interface IVacancyInfo extends IVacancyData {
  id: number
  createdAt?: string
  updatedAt?: string
  favoriteId?: number
  employer: {
    companyName: string
    email?: string
  }
  message?: string
}
