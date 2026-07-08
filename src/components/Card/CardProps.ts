import { IVacancyCard } from '@/types/entities/global'

export interface ICardProps {
  vacancy: IVacancyCard
  onFavoriteChange?: () => void | Promise<void>
}
