import { IVacancyInfo } from '@/types/entities/vacancy.types'

export interface ICardProps {
  vacancy: IVacancyInfo
  onFavoriteChange?: () => void | Promise<void>
}
