import Skeleton from 'react-loading-skeleton'

const VacancyCardSkeleton = () => {
  return (
    <div className="card" style={{ minWidth: '320px' }}>
      <div className="card-header">
        <Skeleton circle width={48} height={48} />
        <div
          className="card-header-info"
          style={{ flex: 1, marginLeft: '12px' }}>
          <Skeleton width="100%" height={16} style={{ marginBottom: '8px' }} />
          <Skeleton width="80%" height={14} />
        </div>
        <Skeleton circle width={24} height={24} />
      </div>
      <div className="card-body">
        <Skeleton width="80%" height={20} style={{ marginBottom: '12px' }} />
        <Skeleton width="30%" height={18} style={{ marginBottom: '12px' }} />
        <Skeleton width="40%" height={14} />
      </div>
    </div>
  )
}

export default VacancyCardSkeleton
