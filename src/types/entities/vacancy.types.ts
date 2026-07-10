export enum EWorkType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  OFFICE = 'OFFICE',
}

export interface IVacancy {
  id: number
  title: string
  salary: string
  location: string
  workType: EWorkType
  description?: string
  createdAt: string
  updatedAt: string
  favoriteId: number
  employer: {
    companyName: string
    employer: string
    email?: string
  }
  message?: string
}

export type VacancyPreview = Pick<
  IVacancy,
  'id' | 'employer' | 'location' | 'title' | 'salary' | 'workType'
>

export type IVacancyCreateData = Omit<
  IVacancy,
  'id' | 'createdAt' | 'updatedAt' | 'favoriteId' | 'employer' | 'message'
>
