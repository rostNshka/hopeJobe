import { VacancyPreview } from '@/types/entities/vacancy.types'

export interface ICardProps {
  vacancy: VacancyPreview
  onFavoriteChange?: () => void | Promise<void>
}
